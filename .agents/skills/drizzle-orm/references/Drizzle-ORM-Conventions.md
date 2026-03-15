# Drizzle ORM Conventions

## Overview

The project uses Drizzle ORM with PostgreSQL (Neon serverless). All queries follow a class-based pattern extending `BaseQuery` with standardized context handling, permission filtering, circuit breaker resilience, and error handling.

## File Structure

```
src/lib/queries/
├── base/
│   ├── base-query.ts         # Abstract base class with resilience methods
│   ├── query-context.ts      # Context types and factory functions
│   └── permission-filters.ts # Permission and soft delete filter builders
├── {domain}/
│   └── {domain}-query.ts     # Domain-specific queries (or {domain}.query.ts)
```

## File Naming

- **Query files**: `{domain}-query.ts` or `{domain}.query.ts`
- **Query classes**: `{Domain}Query` (e.g., `SocialQuery`, `BobbleheadsQuery`)
- **Methods**: `{verb}{Entity}Async` for async methods (e.g., `getCommentByIdAsync`, `createLikeAsync`)

## Query Class Structure

```typescript
import { and, count, desc, eq, sql } from 'drizzle-orm';

import type { FindOptions, QueryContext } from '@/lib/queries/base/query-context';

import { BaseQuery } from '@/lib/queries/base/base-query';
import { {table} } from '@/lib/db/schema';

export type {Entity}Record = typeof {table}.$inferSelect;

export class {Domain}Query extends BaseQuery {
  // Read operations - single item
  static async findByIdAsync(
    id: string,
    context: QueryContext,
  ): Promise<{Entity}Record | null> {
    const dbInstance = this.getDbInstance(context);

    const result = await dbInstance
      .select()
      .from({table})
      .where(
        this.combineFilters(
          eq({table}.id, id),
          this.buildBaseFilters({table}.isPublic, {table}.userId, {table}.deletedAt, context),
        ),
      )
      .limit(1);

    return result[0] || null;
  }

  // List operations with pagination
  static async findAllAsync(
    options: FindOptions = {},
    context: QueryContext,
  ): Promise<Array<{Entity}Record>> {
    const dbInstance = this.getDbInstance(context);
    const pagination = this.applyPagination(options);

    const query = dbInstance
      .select()
      .from({table})
      .where(
        this.buildBaseFilters({table}.isPublic, {table}.userId, {table}.deletedAt, context),
      )
      .orderBy(desc({table}.createdAt));

    if (pagination.limit) {
      query.limit(pagination.limit);
    }

    if (pagination.offset) {
      query.offset(pagination.offset);
    }

    return query;
  }

  // Create operations
  static async createAsync(
    data: Insert{Entity},
    userId: string,
    context: QueryContext,
  ): Promise<{Entity}Record | null> {
    const dbInstance = this.getDbInstance(context);

    const result = await dbInstance
      .insert({table})
      .values({ ...data, userId })
      .returning();

    return result?.[0] || null;
  }

  // Update operations with ownership check
  static async updateAsync(
    data: Update{Entity},
    userId: string,
    context: QueryContext,
  ): Promise<{Entity}Record | null> {
    const dbInstance = this.getDbInstance(context);
    const { id, ...updateData } = data;

    const result = await dbInstance
      .update({table})
      .set(updateData)
      .where(and(eq({table}.id, id), eq({table}.userId, userId)))
      .returning();

    return result?.[0] || null;
  }

  // Soft delete operations
  static async deleteAsync(
    id: string,
    userId: string,
    context: QueryContext,
  ): Promise<{Entity}Record | null> {
    const dbInstance = this.getDbInstance(context);

    const result = await dbInstance
      .update({table})
      .set({ deletedAt: new Date() })
      .where(and(eq({table}.id, id), eq({table}.userId, userId)))
      .returning();

    return result?.[0] || null;
  }
}
```

## Query Context

### QueryContext Interface

```typescript
interface QueryContext {
  /** Database instance (transaction or main db) */
  dbInstance?: DatabaseExecutor;
  /** Public access mode - only return public content */
  isPublic?: boolean;
  /** Required user ID (for protected/owner-only operations) */
  requiredUserId?: string;
  /** Include soft-deleted records */
  shouldIncludeDeleted?: boolean;
  /** Current user ID (optional for public queries) */
  userId?: string;
}
```

### BaseContextHelpers Abstract Base Class

Both `BaseQuery` and `BaseFacade` extend `BaseContextHelpers`, which provides convenient context creation methods. These are **protected static methods** available within queries and facades:

```typescript
// src/lib/queries/base/base-context-helpers.ts
export abstract class BaseContextHelpers {
  /** Create a QueryContext for admin access */
  protected static adminContext(adminUserId: string, dbInstance?: DatabaseExecutor): QueryContext;

  /** Create a QueryContext for protected/owner-only operations */
  protected static protectedContext(userId: string, dbInstance?: DatabaseExecutor): QueryContext;

  /** Create a QueryContext for public access only */
  protected static publicContext(dbInstance?: DatabaseExecutor): QueryContext;

  /** Create a QueryContext for authenticated user access */
  protected static userContext(userId: string, dbInstance?: DatabaseExecutor): QueryContext;

  /** Create a QueryContext for viewer-based access (user if logged in, else public) */
  protected static viewerContext(
    viewerUserId: string | undefined,
    dbInstance?: DatabaseExecutor,
  ): QueryContext;

  /** Create owner-or-viewer context (protected if viewer is owner, else viewer context) */
  protected static ownerOrViewerContext(
    ownerId: string,
    viewerUserId: string | undefined,
    dbInstance?: DatabaseExecutor,
  ): QueryContext;
}
```

#### Using Context Helpers in Queries/Facades

```typescript
// Inside a Query or Facade class
static async findByIdAsync(id: string, viewerUserId?: string, dbInstance?: DatabaseExecutor) {
  // Use the helper instead of calling factory functions directly
  const context = this.viewerContext(viewerUserId, dbInstance);
  return await this.executeQuery(context);
}

static async updateAsync(id: string, userId: string, dbInstance?: DatabaseExecutor) {
  // Owner-only operations use protectedContext
  const context = this.protectedContext(userId, dbInstance);
  return await this.executeUpdate(context);
}

static async getPublicDataAsync(dbInstance?: DatabaseExecutor) {
  // Public operations
  const context = this.publicContext(dbInstance);
  return await this.executeQuery(context);
}

static async getDataForOwnerOrViewerAsync(
  ownerId: string,
  viewerUserId?: string,
  dbInstance?: DatabaseExecutor
) {
  // Returns protected context if viewer is owner, otherwise viewer context
  const context = this.ownerOrViewerContext(ownerId, viewerUserId, dbInstance);
  return await this.executeQuery(context);
}
```

### Context Factory Functions

For direct use outside of Query/Facade classes:

```typescript
import {
  createAdminQueryContext,
  createProtectedQueryContext,
  createPublicQueryContext,
  createUserQueryContext,
} from '@/lib/queries/base/query-context';

// For public read operations (only returns public content)
const context = createPublicQueryContext({ dbInstance });

// For authenticated user read operations (public + user's own content)
const context = createUserQueryContext(userId, { dbInstance });

// For owner-only operations (only user's own content)
const context = createProtectedQueryContext(requiredUserId, { dbInstance: tx });

// For admin/moderator access (can see all content)
const context = createAdminQueryContext(adminUserId, { shouldIncludeDeleted: true });
```

### FindOptions Interface

```typescript
interface FindOptions {
  /** Maximum number of records to return */
  limit?: number;
  /** Number of records to skip */
  offset?: number;
  /** Order by expressions */
  orderBy?: Array<SQL>;
  /** Search term for text-based filtering */
  search?: string;
}
```

## Permission Filtering

### Using buildBaseFilters (Recommended)

```typescript
// Combines permission filter + soft delete filter automatically
const result = await dbInstance
  .select()
  .from({ table })
  .where(
    this.combineFilters(
      eq({ table }.id, id),
      this.buildBaseFilters(
        { table }.isPublic, // isPublic column (or undefined if not applicable)
        { table }.userId, // userId column for ownership check
        { table }.deletedAt, // deletedAt column (or undefined if no soft delete)
        context,
      ),
    ),
  )
  .limit(1);
```

### Standalone Filter Functions

```typescript
import {
  buildOwnershipFilter,
  buildPermissionFilter,
  buildSoftDeleteFilter,
  combineFilters,
} from '@/lib/queries/base/permission-filters';

// Permission filter only
const permFilter = buildPermissionFilter({ table }.isPublic, { table }.userId, context);

// Soft delete filter only (returns isNull(deletedAt) unless shouldIncludeDeleted is true)
const deleteFilter = buildSoftDeleteFilter({ table }.deletedAt, context);

// Ownership filter only
const ownerFilter = buildOwnershipFilter({ table }.userId, context);

// Combine multiple filters
const combined = combineFilters(permFilter, deleteFilter, eq({ table }.id, id));
```

### Filter Logic by Context

| Context Type | isPublic | userId | requiredUserId | Filter Result                                |
| ------------ | -------- | ------ | -------------- | -------------------------------------------- |
| Public       | true     | -      | -              | `isPublic = true` only                       |
| User         | -        | set    | -              | `isPublic = true OR userId = context.userId` |
| Protected    | -        | set    | set            | `userId = requiredUserId` (owner only)       |
| Admin        | -        | set    | -              | All content (no filter)                      |

## Pagination

### Using applyPagination

```typescript
static async findAllAsync(
  options: FindOptions = {},
  context: QueryContext,
): Promise<Array<ItemRecord>> {
  const dbInstance = this.getDbInstance(context);
  const pagination = this.applyPagination(options);

  const query = dbInstance
    .select()
    .from(items)
    .orderBy(desc(items.createdAt));

  // Apply pagination conditionally
  if (pagination.limit) {
    query.limit(pagination.limit);
  }

  if (pagination.offset) {
    query.offset(pagination.offset);
  }

  return query;
}
```

Note: `applyPagination` automatically caps limit at `DEFAULTS.PAGINATION.MAX_LIMIT`.

## Resilience Patterns

### Using executeWithRetry

For operations that may encounter transient errors, use the circuit breaker + retry wrapper:

```typescript
static async findWithRetryAsync(
  id: string,
  context: QueryContext,
): Promise<{Entity}Record | null> {
  return this.executeWithRetry(
    async () => {
      const dbInstance = this.getDbInstance(context);
      const result = await dbInstance
        .select()
        .from({table})
        .where(
          this.combineFilters(
            eq({table}.id, id),
            this.buildBaseFilters({table}.isPublic, {table}.userId, {table}.deletedAt, context),
          ),
        )
        .limit(1);
      return result[0] || null;
    },
    '{Domain}Query.findWithRetryAsync',
  );
}
```

### Using executeWithRetryDetails

When you need retry metadata:

```typescript
static async findWithMetadataAsync(
  id: string,
  context: QueryContext,
): Promise<RetryResult<{Entity}Record | null>> {
  return this.executeWithRetryDetails(
    async () => {
      const dbInstance = this.getDbInstance(context);
      const result = await dbInstance
        .select()
        .from({table})
        .where(
          this.combineFilters(
            eq({table}.id, id),
            this.buildBaseFilters({table}.isPublic, {table}.userId, {table}.deletedAt, context),
          ),
        )
        .limit(1);
      return result[0] || null;
    },
    '{Domain}Query.findWithMetadataAsync',
  );
}
```

## Common Query Patterns

### Select with Joins

```typescript
static async findByIdWithRelationsAsync(
  id: string,
  context: QueryContext,
): Promise<EntityWithRelations | null> {
  const dbInstance = this.getDbInstance(context);

  const result = await dbInstance
    .select({
      entity: entities,
      related: relatedTable,
    })
    .from(entities)
    .leftJoin(relatedTable, eq(entities.relatedId, relatedTable.id))
    .where(
      this.combineFilters(
        eq(entities.id, id),
        this.buildBaseFilters(entities.isPublic, entities.userId, entities.deletedAt, context),
      ),
    )
    .limit(1);

  if (!result[0]) return null;

  return {
    ...result[0].entity,
    relatedName: result[0].related?.name || null,
  };
}
```

### User Data Joins (Raw SQL)

When joining with the users table (managed by Clerk), use raw SQL:

```typescript
static async getWithUserAsync(
  id: string,
  context: QueryContext,
): Promise<EntityWithUser | null> {
  const dbInstance = this.getDbInstance(context);

  const result = await dbInstance
    .select({
      content: entities.content,
      id: entities.id,
      user: {
        avatarUrl: sql<null | string>`users.avatar_url`,
        displayName: sql<null | string>`users.display_name`,
        id: sql<string>`users.id`,
        username: sql<null | string>`users.username`,
      },
      userId: entities.userId,
    })
    .from(entities)
    .leftJoin(
      sql`users`,
      and(eq(entities.userId, sql`users.id`), isNull(sql`users.deleted_at`)),
    )
    .where(and(eq(entities.id, id), isNull(entities.deletedAt)))
    .limit(1);

  return result?.[0] || null;
}
```

### Count Queries

```typescript
static async getCountAsync(
  targetId: string,
  context: QueryContext,
): Promise<number> {
  const dbInstance = this.getDbInstance(context);

  const result = await dbInstance
    .select({ count: count() })
    .from(items)
    .where(eq(items.targetId, targetId));

  return result[0]?.count || 0;
}
```

### Batch Operations with Map Return

```typescript
static async findByIdsAsync(
  ids: Array<string>,
  context: QueryContext,
): Promise<Map<string, ItemData>> {
  const dbInstance = this.getDbInstance(context);
  const result = new Map<string, ItemData>();

  if (ids.length === 0) {
    return result;
  }

  const items = await dbInstance
    .select()
    .from(table)
    .where(inArray(table.id, ids));

  for (const item of items) {
    result.set(item.id, item);
  }

  return result;
}
```

### Increment/Decrement Counters

```typescript
static async incrementCountAsync(
  targetId: string,
  context: QueryContext,
): Promise<void> {
  const dbInstance = this.getDbInstance(context);

  await dbInstance
    .update(table)
    .set({ count: sql`${table.count} + 1` })
    .where(eq(table.id, targetId));
}

static async decrementCountAsync(
  targetId: string,
  context: QueryContext,
): Promise<void> {
  const dbInstance = this.getDbInstance(context);

  // Use GREATEST to prevent negative counts
  await dbInstance
    .update(table)
    .set({ count: sql`GREATEST(0, ${table.count} - 1)` })
    .where(eq(table.id, targetId));
}
```

### Boolean Check Queries

```typescript
static async hasRepliesAsync(
  parentId: string,
  context: QueryContext,
): Promise<boolean> {
  const dbInstance = this.getDbInstance(context);

  const result = await dbInstance
    .select({ id: items.id })
    .from(items)
    .where(and(eq(items.parentId, parentId), eq(items.isDeleted, false)))
    .limit(1);

  return result.length > 0;
}
```

### Search with Filters

```typescript
static async searchAsync(
  searchTerm: string,
  filters: { category?: string; userId?: string } = {},
  options: FindOptions = {},
  context: QueryContext,
): Promise<Array<Record>> {
  const dbInstance = this.getDbInstance(context);
  const pagination = this.applyPagination(options);

  const conditions = [
    this.buildBaseFilters(table.isPublic, table.userId, table.deletedAt, context),
  ];

  // Escape special characters in search term
  const escapedSearchTerm = searchTerm.replace(/[%_]/g, '\\$&');
  if (escapedSearchTerm) {
    conditions.push(
      or(
        like(table.name, `%${escapedSearchTerm}%`),
        like(table.description, `%${escapedSearchTerm}%`),
      ),
    );
  }

  // Add optional filters
  if (filters.userId) conditions.push(eq(table.userId, filters.userId));
  if (filters.category) conditions.push(eq(table.category, filters.category));

  const query = dbInstance
    .select()
    .from(table)
    .where(this.combineFilters(...conditions.filter(Boolean)))
    .orderBy(desc(table.createdAt));

  if (pagination.limit) {
    query.limit(pagination.limit);
  }

  if (pagination.offset) {
    query.offset(pagination.offset);
  }

  return query;
}
```

## SQL Helpers

### Type-Safe SQL Expressions

```typescript
import { sql } from 'drizzle-orm';

// Type-safe SQL expressions for user data
const avatarUrl = sql<null | string>`users.avatar_url`;

// Date comparisons
const recentItems = sql`${table.createdAt} >= NOW() - INTERVAL '7 days'`;

// CASE expressions for conditional counting
const recentCount = count(sql`CASE WHEN ${table.createdAt} >= NOW() - INTERVAL '7 days' THEN 1 END`);

// Safe counter decrement (never go below 0)
const safeDecrement = sql`GREATEST(0, ${table.count} - 1)`;
```

## Return Value Conventions

| Query Type    | Return Type                                | Empty Result                    |
| ------------- | ------------------------------------------ | ------------------------------- |
| Single item   | `T \| null`                                | `null`                          |
| List          | `Array<T>`                                 | `[]`                            |
| Count         | `number`                                   | `0`                             |
| Boolean check | `boolean`                                  | `false`                         |
| Map           | `Map<K, V>`                                | `new Map()`                     |
| Delete result | `{ entity: T \| null; related: Array<R> }` | `{ entity: null, related: [] }` |

## Type Exports

Export types using Drizzle's type inference:

```typescript
// Basic record type
export type EntityRecord = typeof table.$inferSelect;

// Record with relations
export type EntityWithRelations = EntityRecord & {
  relatedName: null | string;
  photos: Array<typeof photos.$inferSelect>;
  tags: Array<typeof tags.$inferSelect>;
};

// Record with user data
export type EntityWithUser = PublicEntity & {
  user: null | {
    avatarUrl: null | string;
    displayName: null | string;
    id: string;
    username: null | string;
  };
};
```

## Email Normalization

When working with email addresses in queries, always use the `normalizeEmail` helper to ensure consistent storage and case-insensitive lookups.

### Using normalizeEmail

```typescript
// In a query class extending BaseQuery
static async findByEmailAsync(
  email: string,
  context: QueryContext,
): Promise<SubscriberRecord | null> {
  const dbInstance = this.getDbInstance(context);
  const normalizedEmail = this.normalizeEmail(email);

  const result = await dbInstance
    .select()
    .from(subscribers)
    .where(eq(subscribers.email, normalizedEmail))
    .limit(1);

  return result[0] || null;
}

// For create operations - always normalize before storing
static async createAsync(
  email: string,
  context: QueryContext,
): Promise<SubscriberRecord | null> {
  const dbInstance = this.getDbInstance(context);

  const result = await dbInstance
    .insert(subscribers)
    .values({ email: this.normalizeEmail(email) })
    .returning();

  return result?.[0] || null;
}
```

### What normalizeEmail Does

```typescript
protected static normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}
```

- Converts email to lowercase for case-insensitive matching
- Trims leading/trailing whitespace

### When to Use

- **Lookups**: Always normalize the input email before querying
- **Inserts**: Always normalize before storing to ensure consistent data
- **Updates**: Normalize email fields being updated
- **Comparisons**: Normalize both sides when comparing emails outside of queries

## Anti-Patterns to Avoid

1. **Never access `db` directly** - Always use `this.getDbInstance(context)`
2. **Never skip permission filters** - Always use `buildBaseFilters` for user-visible data
3. **Never return undefined** - Return `null` for missing single items
4. **Never use raw strings in queries** - Use parameterized queries via Drizzle
5. **Never skip pagination limits** - Always apply `applyPagination`
6. **Never hard delete** - Use soft delete with `deletedAt` timestamp column (set to `new Date()`)
7. **Never allow negative counts** - Use `GREATEST(0, count - 1)` for decrements
8. **Never skip ownership checks** - Verify `userId` on update/delete operations
9. **Never ignore circuit breaker** - Use `executeWithRetry` for operations prone to transient failures
10. **Never use raw emails in queries** - Always use `this.normalizeEmail(email)` for consistent case-insensitive matching