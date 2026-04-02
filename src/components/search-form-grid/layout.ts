import type { ColProps, ColSize } from 'antdv-next'

const responsiveBreakpoints = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl'] as const
const responsiveBreakpointsDescending = [...responsiveBreakpoints].reverse()

type ResponsiveBreakpoint = (typeof responsiveBreakpoints)[number]
type ResponsiveColValue = ColProps[ResponsiveBreakpoint]
type ResponsiveScreenMap = Partial<Record<ResponsiveBreakpoint, boolean>>

function toSpan(value: ColProps['span'] | ResponsiveColValue): number | undefined {
  if (typeof value === 'number') {
    return Number.isFinite(value) && value > 0 ? value : undefined
  }

  if (typeof value === 'string') {
    const parsedValue = Number(value)
    return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : undefined
  }

  if (value && typeof value === 'object') {
    return toSpan((value as ColSize).span)
  }

  return undefined
}

function getSpanAtBreakpoint(itemColProps: ColProps, breakpoint: ResponsiveBreakpoint): number {
  const breakpointIndex = responsiveBreakpoints.indexOf(breakpoint)

  for (let index = breakpointIndex; index >= 0; index -= 1) {
    const currentBreakpoint = responsiveBreakpoints[index]
    if (!currentBreakpoint) {
      continue
    }

    const responsiveSpan = toSpan(itemColProps[currentBreakpoint])

    if (responsiveSpan !== undefined) {
      return responsiveSpan
    }
  }

  return toSpan(itemColProps.span) ?? 24
}

function getColumnsAtBreakpoint(itemColProps: ColProps, breakpoint: ResponsiveBreakpoint): number {
  const span = getSpanAtBreakpoint(itemColProps, breakpoint)
  return Math.max(1, Math.floor(24 / span))
}

function getActionSlots(itemCount: number, columns: number): number {
  const remainder = itemCount % columns
  return remainder === 0 ? columns : columns - remainder
}

export function getDefaultCollapsedItemCount(itemColProps: ColProps): number {
  const maxColumns = Math.max(
    ...responsiveBreakpoints.map(breakpoint => getColumnsAtBreakpoint(itemColProps, breakpoint)),
  )

  return maxColumns > 1 ? maxColumns - 1 : 1
}

export function getCollapsedItemCountAtBreakpoint(
  itemColProps: ColProps,
  breakpoint: ResponsiveBreakpoint,
): number {
  const columns = getColumnsAtBreakpoint(itemColProps, breakpoint)
  return columns > 1 ? columns - 1 : 1
}

export function resolveActiveBreakpoint(
  screens?: ResponsiveScreenMap | null,
): ResponsiveBreakpoint | undefined {
  if (!screens) {
    return undefined
  }

  return responsiveBreakpointsDescending.find(breakpoint => screens[breakpoint])
}

export function createActionColProps(itemColProps: ColProps, itemCount: number): ColProps {
  const actionColProps: ColProps = {
    span: 24,
  }

  for (const breakpoint of responsiveBreakpoints) {
    const itemSpan = getSpanAtBreakpoint(itemColProps, breakpoint)
    const columns = getColumnsAtBreakpoint(itemColProps, breakpoint)
    actionColProps[breakpoint] = Math.min(24, itemSpan * getActionSlots(itemCount, columns))
  }

  return actionColProps
}

export function shouldShowCollapseToggle(
  itemCount: number,
  itemColProps: ColProps,
  collapsedItemCount?: number,
): boolean {
  return itemCount > Math.max(1, collapsedItemCount ?? getDefaultCollapsedItemCount(itemColProps))
}
