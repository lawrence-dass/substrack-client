"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50 max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  )
}

const DialogContent: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => {
  return (
    <div className={cn(
      "bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-md w-full p-6",
      className
    )}>
      {children}
    </div>
  )
}

const DialogHeader: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => {
  return (
    <div className={cn("mb-6", className)}>
      {children}
    </div>
  )
}

const DialogTitle: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => {
  return (
    <h2 className={cn("text-xl font-semibold text-gray-900 dark:text-white", className)}>
      {children}
    </h2>
  )
}

const DialogDescription: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => {
  return (
    <p className={cn("text-sm text-gray-600 dark:text-gray-400 mt-2", className)}>
      {children}
    </p>
  )
}

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } 