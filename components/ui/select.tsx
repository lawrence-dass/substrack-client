"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SelectContextType {
  value?: string
  onSelect: (value: string) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const SelectContext = React.createContext<SelectContextType | null>(null)

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

const Select: React.FC<SelectProps> = ({ 
  value, 
  onValueChange, 
  children 
}) => {
  const [isOpen, setIsOpen] = React.useState(false)
  
  const handleSelect = (selectedValue: string) => {
    onValueChange?.(selectedValue)
    setIsOpen(false)
  }
  
  return (
    <SelectContext.Provider value={{ value, onSelect: handleSelect, isOpen, setIsOpen }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

const SelectTrigger: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => {
  const context = React.useContext(SelectContext)
  
  const handleClick = () => {
    context?.setIsOpen(!context.isOpen)
  }
  
  return (
    <button
      type="button"
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        context?.isOpen ? 'ring-2 ring-ring' : '',
        className
      )}
      onClick={handleClick}
    >
      {children}
      <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 opacity-50"
      >
        <path
          d="m4.93179 5.43179c.20264-.20264.53014-.20264.73278 0L7.5 7.26695l1.83543-1.83516c.2026-.20264.5301-.20264.7328 0 .2026.20264.2026.53014 0 .73278L8.23223 8.03223c-.20264.20264-.53014.20264-.73278 0L5.66445 6.16501c-.20264-.20264-.20264-.53014 0-.73278Z"
          fill="currentColor"
        />
      </svg>
    </button>
  )
}

const SelectValue: React.FC<{
  placeholder?: string
}> = ({ placeholder }) => {
  const context = React.useContext(SelectContext)
  
  const getDisplayText = () => {
    if (!context?.value) return placeholder
    return context.value
  }
  
  return (
    <span className="truncate">
      {context?.value ? (
        <span className="text-foreground">{getDisplayText()}</span>
      ) : (
        <span className="text-muted-foreground">{placeholder}</span>
      )}
    </span>
  )
}

const SelectContent: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const context = React.useContext(SelectContext)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        context?.setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        context?.setIsOpen(false)
      }
    }

    if (context?.isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [context?.isOpen])

  if (!context?.isOpen) return null

  return (
    <div
      ref={ref}
      className="absolute top-full z-50 w-full min-w-[8rem] overflow-hidden rounded-md border bg-white dark:bg-slate-800 p-1 shadow-lg mt-1"
    >
      {children}
    </div>
  )
}

const SelectGroup: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <div className="py-1">
      {children}
    </div>
  )
}

const SelectLabel: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => {
  return (
    <div className={cn(
      "py-1.5 pl-8 pr-2 text-sm font-semibold text-slate-900 dark:text-slate-100",
      className
    )}>
      {children}
    </div>
  )
}

const SelectItem: React.FC<{
  value: string
  children: React.ReactNode
}> = ({ value, children }) => {
  const context = React.useContext(SelectContext)
  
  const handleClick = () => {
    context?.onSelect(value)
  }

  const isSelected = context?.value === value

  return (
    <div
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 px-2 text-sm outline-none hover:bg-slate-100 dark:hover:bg-slate-700 focus:bg-slate-100 dark:focus:bg-slate-700",
        isSelected && "bg-slate-100 dark:bg-slate-700"
      )}
      onClick={handleClick}
    >
      {children}
    </div>
  )
}

export { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } 