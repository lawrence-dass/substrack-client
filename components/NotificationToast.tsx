"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface NotificationToastProps {
  title: string
  description?: string
  type?: "success" | "error" | "info"
  autoClose?: boolean
  autoCloseDelay?: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function NotificationToast({
  title,
  description,
  type = "success",
  autoClose = true,
  autoCloseDelay = 3000,
  open,
  onOpenChange
}: NotificationToastProps) {
  useEffect(() => {
    if (open && autoClose) {
      const timer = setTimeout(() => {
        onOpenChange(false)
      }, autoCloseDelay)

      return () => clearTimeout(timer)
    }
  }, [open, autoClose, autoCloseDelay, onOpenChange])

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
      case "error":
        return "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
      case "info":
        return "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
      default:
        return "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
    }
  }

  if (!open) return null

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <div className={cn(
        "w-80 p-4 rounded-lg border shadow-lg",
        getBackgroundColor()
      )}>
        <div className="flex items-start gap-3">
          {getIcon()}
          <div className="grid gap-1 flex-1">
            <h4 className="font-medium leading-none text-sm">{title}</h4>
            {description && (
              <p className="text-xs text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        {!autoClose && (
          <div className="flex justify-end mt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// Hook for managing notification state
export function useNotification() {
  const [notification, setNotification] = useState<{
    open: boolean
    title: string
    description?: string
    type?: "success" | "error" | "info"
  }>({
    open: false,
    title: "",
    description: "",
    type: "success"
  })

  const showNotification = (
    title: string,
    description?: string,
    type: "success" | "error" | "info" = "success"
  ) => {
    setNotification({
      open: true,
      title,
      description,
      type
    })
  }

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, open: false }))
  }

  return {
    notification,
    showNotification,
    hideNotification
  }
} 