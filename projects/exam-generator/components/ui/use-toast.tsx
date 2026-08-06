"use client"

import * as React from "react"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

type ToastActionType = {
  toast: (props: ToastProps) => void
}

const ToastContext = React.createContext<ToastActionType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  const toast = React.useCallback((props: ToastProps) => {
    setToasts((prev) => [...prev, props])
    // Remove toast after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.slice(1))
    }, 5000)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4">
        {toasts.map((t, i) => (
          <div
            key={i}
            className={`p-4 rounded-md shadow-md ${
              t.variant === "destructive" ? "bg-destructive text-destructive-foreground" : "bg-background border"
            }`}
          >
            {t.title && <div className="font-medium">{t.title}</div>}
            {t.description && <div className="text-sm">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = React.useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

