import * as React from "react"
import { cn } from "@/lib/utils"

const Dialog = ({ children, ...props }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div {...props}>
      {React.Children.map(children, (child) => {
        if (child.type === DialogTrigger) {
          return React.cloneElement(child, { onClick: () => setIsOpen(true) })
        }
        if (child.type === DialogContent && isOpen) {
          return React.cloneElement(child, { onClose: () => setIsOpen(false) })
        }
        return null
      })}
    </div>
  )
}

const DialogTrigger = React.forwardRef(({ className, children, onClick, ...props }, ref) => {
  return React.cloneElement(children, { onClick })
})
DialogTrigger.displayName = "DialogTrigger"

const DialogContent = React.forwardRef(({ className, children, onClose, ...props }, ref) => (
  <>
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={onClose} />
    <div
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <span className="sr-only">Close</span>
        ✕
      </button>
    </div>
  </>
))
DialogContent.displayName = "DialogContent"

const DialogHeader = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = "DialogDescription"

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription }
