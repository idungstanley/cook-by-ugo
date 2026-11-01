import { useId, type ComponentProps, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

const CONTROL_CLASS =
  'w-full rounded-2xl border border-line bg-shea px-4 text-sm text-cocoa placeholder:text-muted transition focus:border-cocoa'

interface FieldShellProps {
  label: string
  error?: string
  id: string
  children: ReactNode
}

const FieldShell = ({ label, error, id, children }: FieldShellProps) => (
  <div>
    <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
      {label}
    </label>
    {children}
    {error && (
      <p id={`${id}-error`} role="alert" className="mt-1 text-xs font-semibold text-jollof">
        {error}
      </p>
    )}
  </div>
)

const describedBy = (id: string, error?: string) =>
  error ? { 'aria-invalid': true, 'aria-describedby': `${id}-error` } : {}

interface FieldProps {
  label: string
  error?: string
}

export const TextField = ({
  label,
  error,
  className,
  ...props
}: FieldProps & ComponentProps<'input'>) => {
  const id = useId()
  return (
    <FieldShell label={label} error={error} id={id}>
      <input
        id={id}
        className={cn(CONTROL_CLASS, 'h-12', className)}
        {...describedBy(id, error)}
        {...props}
      />
    </FieldShell>
  )
}

export const TextAreaField = ({
  label,
  error,
  className,
  ...props
}: FieldProps & ComponentProps<'textarea'>) => {
  const id = useId()
  return (
    <FieldShell label={label} error={error} id={id}>
      <textarea
        id={id}
        rows={2}
        className={cn(CONTROL_CLASS, 'resize-none py-3', className)}
        {...describedBy(id, error)}
        {...props}
      />
    </FieldShell>
  )
}

export const SelectField = ({
  label,
  error,
  className,
  ...props
}: FieldProps & ComponentProps<'select'>) => {
  const id = useId()
  return (
    <FieldShell label={label} error={error} id={id}>
      <select
        id={id}
        className={cn(CONTROL_CLASS, 'h-12', className)}
        {...describedBy(id, error)}
        {...props}
      />
    </FieldShell>
  )
}
