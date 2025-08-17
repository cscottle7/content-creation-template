import { SelectHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  options: SelectOption[]
  placeholder?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, placeholder, id, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`
    const errorId = error ? `${selectId}-error` : undefined
    const helperTextId = helperText ? `${selectId}-helper` : undefined
    
    const baseClasses = 'flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
    const errorClasses = error ? 'border-red-500 focus:ring-red-500' : ''

    return (
      <div className="space-y-2">
        {label && (
          <label 
            htmlFor={selectId}
            className="text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
            {props.required && (
              <span className="text-red-500 ml-1" aria-label="required">*</span>
            )}
          </label>
        )}
        <select
          id={selectId}
          className={cn(baseClasses, errorClasses, className)}
          ref={ref}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={cn(errorId, helperTextId)}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {helperText && !error && (
          <p id={helperTextId} className="text-sm text-gray-600">
            {helperText}
          </p>
        )}
        {error && (
          <p id={errorId} className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)
Select.displayName = 'Select'

export default Select