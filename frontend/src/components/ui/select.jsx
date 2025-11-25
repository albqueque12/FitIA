import * as React from "react"
import { cn } from "@/lib/utils"

const Select = ({ children, value, onValueChange }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedValue, setSelectedValue] = React.useState(value)

  const handleSelect = (newValue) => {
    setSelectedValue(newValue)
    if (onValueChange) onValueChange(newValue)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      {React.Children.map(children, (child) => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, { onClick: () => setIsOpen(!isOpen), selectedValue, isOpen })
        }
        if (child.type === SelectContent && isOpen) {
          return React.cloneElement(child, { onSelect: handleSelect, onClose: () => setIsOpen(false) })
        }
        return null
      })}
    </div>
  )
}

const SelectTrigger = React.forwardRef(({ className, children, onClick, selectedValue, isOpen, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
))
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ placeholder, ...props }) => {
  return <span className="block truncate">{placeholder}</span>
}
SelectValue.displayName = "SelectValue"

const SelectContent = React.forwardRef(({ className, children, onSelect, onClose, ...props }, ref) => (
  <>
    <div className="fixed inset-0 z-40" onClick={onClose} />
    <div
      ref={ref}
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        "top-full mt-1 w-full",
        className
      )}
      {...props}
    >
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { onSelect })
      )}
    </div>
  </>
))
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef(({ className, children, value, onSelect, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    onClick={() => onSelect && onSelect(value)}
    {...props}
  >
    {children}
  </div>
))
SelectItem.displayName = "SelectItem"

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
