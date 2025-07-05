"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "@/lib/utils"

// Chart container component
const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: Record<string, { label: string; color?: string }>
  }
>(({ className, children, config, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("w-full", className)} {...props}>
      <style
        dangerouslySetInnerHTML={{
          __html: Object.entries(config)
            .map(
              ([key, value]) => `
              .recharts-default-tooltip .recharts-tooltip-label,
              .recharts-default-tooltip .recharts-tooltip-item-name {
                color: hsl(var(--foreground));
              }
              .recharts-default-tooltip {
                background-color: hsl(var(--background));
                border: 1px solid hsl(var(--border));
                border-radius: 6px;
              }
            `,
            )
            .join("\n"),
        }}
      />
      {children}
    </div>
  )
})
ChartContainer.displayName = "ChartContainer"

// Chart tooltip component
interface ChartTooltipContentProps {
  active?: boolean
  payload?: Array<{
    value: number
    name: string
    color: string
    dataKey: string
  }>
  label?: string
  formatter?: (value: number, name: string) => [string, string]
  labelFormatter?: (label: string) => string
}

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  ChartTooltipContentProps & React.HTMLAttributes<HTMLDivElement>
>(({ active, payload = [], label, formatter, labelFormatter, className, ...props }, ref) => {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div ref={ref} className={cn("rounded-lg border bg-background p-2 shadow-md", className)} {...props}>
      {label && <div className="mb-2 font-medium">{labelFormatter ? labelFormatter(label) : label}</div>}
      <div className="space-y-1">
        {payload.map((item, index) => {
          const [formattedValue, formattedName] = formatter
            ? formatter(item.value, item.name)
            : [`${item.value}`, item.name]

          return (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="font-medium">{formattedName}:</span>
              <span>{formattedValue}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
})
ChartTooltipContent.displayName = "ChartTooltipContent"

// Chart tooltip wrapper
const ChartTooltip = RechartsPrimitive.Tooltip

// Chart legend component
interface ChartLegendContentProps {
  payload?: Array<{
    value: string
    type: string
    color: string
  }>
  verticalAlign?: "top" | "middle" | "bottom"
}

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  ChartLegendContentProps & React.HTMLAttributes<HTMLDivElement>
>(({ payload = [], className, ...props }, ref) => {
  if (!payload?.length) {
    return null
  }

  return (
    <div ref={ref} className={cn("flex flex-wrap items-center justify-center gap-4", className)} {...props}>
      {payload.map((item, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
          <span>{item.value}</span>
        </div>
      ))}
    </div>
  )
})
ChartLegendContent.displayName = "ChartLegendContent"

// Chart legend wrapper
const ChartLegend = RechartsPrimitive.Legend

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent }
