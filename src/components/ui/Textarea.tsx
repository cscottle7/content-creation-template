import { TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`
    const errorId = error ? `${textareaId}-error` : undefined
    const helperTextId = helperText ? `${textareaId}-helper` : undefined
    
    const baseClasses = 'flex min-h-[80px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y'
    const errorClasses = error ? 'border-red-500 focus:ring-red-500' : ''

    return (
      <div className="space-y-2">
        {label && (
          <label 
            htmlFor={textareaId}
            className="text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
            {props.required && (
              <span className="text-red-500 ml-1" aria-label="required">*</span>
            )}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(baseClasses, errorClasses, className)}
          ref={ref}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={cn(errorId, helperTextId)}
          {...props}
        />
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
Textarea.displayName = 'Textarea'

export default Textarea