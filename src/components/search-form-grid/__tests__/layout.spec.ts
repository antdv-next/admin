import type { ColProps } from 'antdv-next'
import { describe, expect, it } from 'vite-plus/test'
import {
  createActionColProps,
  getCollapsedItemCountAtBreakpoint,
  getDefaultCollapsedItemCount,
  resolveActiveBreakpoint,
  shouldShowCollapseToggle,
} from '@/components/search-form-grid/layout'

const formColProps: ColProps = {
  md: 24,
  sm: 24,
  lg: 12,
  xl: 8,
  xxl: 6,
  xxxl: 6,
}

describe('search form grid layout', () => {
  it('derives the default collapsed item count from the widest breakpoint', () => {
    expect(getDefaultCollapsedItemCount(formColProps)).toBe(3)
  })

  it('derives the collapsed item count from the current breakpoint when fewer columns fit', () => {
    expect(getCollapsedItemCountAtBreakpoint(formColProps, 'xl')).toBe(2)
    expect(getCollapsedItemCountAtBreakpoint(formColProps, 'xxl')).toBe(3)
  })

  it('uses the remaining slots for the action column when the row is not full', () => {
    expect(createActionColProps(formColProps, 2)).toMatchObject({
      lg: 24,
      xl: 8,
      xxl: 12,
      xxxl: 12,
    })
  })

  it('moves the action column onto its own row when the fields fill the row', () => {
    expect(createActionColProps(formColProps, 4)).toMatchObject({
      lg: 24,
      xl: 16,
      xxl: 24,
      xxxl: 24,
    })
  })

  it('still keeps the collapse toggle available when the action column moves onto its own row', () => {
    expect(createActionColProps(formColProps, 4)).toMatchObject({
      xxl: 24,
      xxxl: 24,
    })
    expect(shouldShowCollapseToggle(4, formColProps)).toBe(true)
  })

  it('detects the active breakpoint from the current responsive screens', () => {
    expect(resolveActiveBreakpoint({ xl: true, lg: true, md: true })).toBe('xl')
    expect(resolveActiveBreakpoint({ xs: true })).toBe('xs')
  })

  it('keeps one slot for the action column in collapsed mode when four slots are available', () => {
    const collapsedVisibleCount = getDefaultCollapsedItemCount(formColProps)

    expect(collapsedVisibleCount).toBe(3)
    expect(createActionColProps(formColProps, collapsedVisibleCount)).toMatchObject({
      lg: 12,
      xl: 24,
      xxl: 6,
      xxxl: 6,
    })
  })

  it('shows the collapse toggle only when the fields overflow the default collapsed row', () => {
    expect(shouldShowCollapseToggle(3, formColProps)).toBe(false)
    expect(shouldShowCollapseToggle(6, formColProps)).toBe(true)
    expect(
      shouldShowCollapseToggle(
        3,
        formColProps,
        getCollapsedItemCountAtBreakpoint(formColProps, 'xl'),
      ),
    ).toBe(true)
  })
})
