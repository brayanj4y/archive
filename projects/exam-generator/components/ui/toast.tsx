"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"

import { cn } from "@/lib/utils"

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root>
>(({ className, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-5 shadow-lg transition-all data-[swipe:closed]:animate-toast-swipe-out data-[state=open]:animate-toast-in data-[state=closed]:animate-toast-out data-[swipe:end]:animate-toast-swipe-out sm:w-[385px]",
        className,
      )}
      {...props}
    >
      <div className="flex w-full flex-col gap-1">
        <ToastPrimitives.Title className="text-sm font-semibold [&[data-variant='destructive']]:text-destructive">
          {props.title}
        </ToastPrimitives.Title>
        <ToastPrimitives.Description className="text-sm opacity-70 [&[data-variant='destructive']]:text-destructive">
          {props.description}
        </ToastPrimitives.Description>
      </div>
      <ToastPrimitives.Action asChild altText="Close">
        <button className="absolute right-2 top-2 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:shadow-sm">
          <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="h-4 w-4">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 13.414l-4.95 4.95-1.414-1.414L10.586 12l-4.95-4.95 1.414-1.414L12 10.586l4.95-4.95 1.414 1.414L13.414 12l4.95 4.95-1.414 1.414L12 13.414z"
            />
          </svg>
        </button>
      </ToastPrimitives.Action>
    </ToastPrimitives.Root>
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => {
  return (
    <ToastPrimitives.Viewport
      ref={ref}
      className={cn(
        "fixed inset-0 z-[100] flex flex-col-reverse p-4 sm:bottom-8 sm:right-8 sm:top-auto sm:left-auto",
        className,
      )}
      {...props}
    />
  )
})
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const ToastProvider = ToastPrimitives.Provider

export { Toast, ToastViewport, ToastProvider }

import { useToast as useShadcnToast } from "@/components/ui/use-toast"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export const toast = ({ title, description, variant = "default" }: ToastProps) => {
  useShadcnToast().toast({
    title,
    description,
    variant,
  })
}

