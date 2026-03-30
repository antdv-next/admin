import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import mockDevBtns from '../mock/dev/btns.ts'
import { createPermissionTypeSource, extractPermissionCodes } from '../src/utils/permission.ts'
import type { PermissionLike } from '../src/utils/permission.ts'

const OUTPUT_PATH = resolve(process.cwd(), 'types/permission.d.ts')
const DEFAULT_PERMISSION_API_URL = 'http://127.0.0.1:6800/api/dev/btns'

function isResolvedMockResponse(value: unknown): value is { body: { data?: unknown[] } } {
  return typeof value === 'object' && value !== null && '__mockResponse' in value
}

async function fetchPermissionData() {
  const permissionApiUrl = process.env.PERMISSION_API_URL ?? DEFAULT_PERMISSION_API_URL

  try {
    const response = await fetch(permissionApiUrl, {
      headers: {
        accept: 'application/json',
      },
    })
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    const body = (await response.json()) as { data?: unknown[] }
    return {
      source: permissionApiUrl,
      data: Array.isArray(body?.data) ? body.data : [],
    }
  } catch (error) {
    if (process.env.PERMISSION_API_URL) {
      throw error
    }

    const resolved = await Promise.resolve(mockDevBtns.GET())

    const body = isResolvedMockResponse(resolved)
      ? resolved.body
      : (resolved as { data?: unknown[] })

    return {
      source: 'mock/dev/btns.ts',
      data: Array.isArray(body?.data) ? body.data : [],
    }
  }
}

async function main() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('gen:perType only supports development usage.')
  }

  const { data, source } = await fetchPermissionData()
  const permissionCodes = extractPermissionCodes(
    data as (string | PermissionLike | null | undefined)[],
  )
  const sourceCode = createPermissionTypeSource(permissionCodes)

  await mkdir(dirname(OUTPUT_PATH), { recursive: true })
  await writeFile(OUTPUT_PATH, sourceCode, 'utf8')

  console.log(`Generated ${permissionCodes.length} permission codes from ${source}`)
  console.log(`Wrote ${OUTPUT_PATH}`)
}

main().catch(error => {
  console.error('[gen:perType] Failed to generate permission types.')
  console.error(error)
  process.exitCode = 1
})
