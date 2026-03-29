import { describe, expect, it } from 'vite-plus/test'
import { toTree } from '@/utils/to-tree'

interface TreeItem {
  id: string
  parentId?: string | null
  sort?: number
  title: string
}

describe('toTree', () => {
  it('converts a flat list into a sorted tree and keeps orphans at root', () => {
    const items: TreeItem[] = [
      { id: 'child-b', parentId: 'root-a', sort: 2, title: 'child-b' },
      { id: 'orphan', parentId: 'missing', sort: 3, title: 'orphan' },
      { id: 'root-b', sort: 2, title: 'root-b' },
      { id: 'child-a', parentId: 'root-a', sort: 1, title: 'child-a' },
      { id: 'root-a', sort: 1, title: 'root-a' },
    ]

    expect(
      toTree(items, {
        getId: item => item.id,
        getParentId: item => item.parentId,
        getSortValue: item => item.sort,
      }),
    ).toEqual([
      {
        id: 'root-a',
        sort: 1,
        title: 'root-a',
        children: [
          {
            id: 'child-a',
            parentId: 'root-a',
            sort: 1,
            title: 'child-a',
            children: [],
          },
          {
            id: 'child-b',
            parentId: 'root-a',
            sort: 2,
            title: 'child-b',
            children: [],
          },
        ],
      },
      {
        id: 'root-b',
        sort: 2,
        title: 'root-b',
        children: [],
      },
      {
        id: 'orphan',
        parentId: 'missing',
        sort: 3,
        title: 'orphan',
        children: [],
      },
    ])
  })
})
