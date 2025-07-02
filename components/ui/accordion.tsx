"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface AccordionContextValue {
  openItems: Set<string>
  toggleItem: (value: string) => void
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null)

interface AccordionProps {
  children: React.ReactNode
  type?: "single" | "multiple"
  defaultValue?: string | string[]
  className?: string
}

const Accordion: React.FC<AccordionProps> = ({
  children,
  type = "single",
  defaultValue,
  className
}) => {
  const [openItems, setOpenItems] = React.useState<Set<string>>(() => {
    if (defaultValue) {
      if (Array.isArray(defaultValue)) {
        return new Set(defaultValue)
      } else {
        return new Set([defaultValue])
      }
    }
    return new Set()
  })

  const toggleItem = (value: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev)
      if (type === "single") {
        if (newSet.has(value)) {
          newSet.clear()
        } else {
          newSet.clear()
          newSet.add(value)
        }
      } else {
        if (newSet.has(value)) {
          newSet.delete(value)
        } else {
          newSet.add(value)
        }
      }
      return newSet
    })
  }

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className={cn("space-y-2", className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemProps {
  children: React.ReactNode
  value: string
  className?: string
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  children,
  value,
  className
}) => {
  return (
    <div
      className={cn(
        "border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden",
        className
      )}
      data-value={value}
    >
      {children}
    </div>
  )
}

interface AccordionTriggerProps {
  children: React.ReactNode
  className?: string
}

const AccordionTrigger: React.FC<AccordionTriggerProps> = ({
  children,
  className
}) => {
  const context = React.useContext(AccordionContext)
  const parentItem = React.useContext(AccordionItemContext)
  
  if (!context || !parentItem) {
    throw new Error("AccordionTrigger must be used within Accordion and AccordionItem")
  }

  const isOpen = context.openItems.has(parentItem.value)

  return (
    <button
      className={cn(
        "flex w-full items-center justify-between px-4 py-3 text-left font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-800",
        className
      )}
      onClick={() => context.toggleItem(parentItem.value)}
      aria-expanded={isOpen}
    >
      {children}
      <svg
        className={cn(
          "h-4 w-4 transition-transform duration-200",
          isOpen ? "transform rotate-180" : ""
        )}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
  )
}

interface AccordionContentProps {
  children: React.ReactNode
  className?: string
}

const AccordionContent: React.FC<AccordionContentProps> = ({
  children,
  className
}) => {
  const context = React.useContext(AccordionContext)
  const parentItem = React.useContext(AccordionItemContext)
  
  if (!context || !parentItem) {
    throw new Error("AccordionContent must be used within Accordion and AccordionItem")
  }

  const isOpen = context.openItems.has(parentItem.value)

  return (
    <div
      className={cn(
        "overflow-hidden transition-all duration-200",
        isOpen ? "max-h-screen" : "max-h-0"
      )}
    >
      <div className={cn("px-4 py-3 border-t border-gray-200 dark:border-gray-700", className)}>
        {children}
      </div>
    </div>
  )
}

// Context for AccordionItem to provide value to children
interface AccordionItemContextValue {
  value: string
}

const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(null)

// Wrapper for AccordionItem to provide context
const AccordionItemWrapper: React.FC<AccordionItemProps> = ({ children, value, className }) => {
  return (
    <AccordionItemContext.Provider value={{ value }}>
      <AccordionItem value={value} className={className}>
        {children}
      </AccordionItem>
    </AccordionItemContext.Provider>
  )
}

export { Accordion, AccordionItemWrapper as AccordionItem, AccordionTrigger, AccordionContent } 