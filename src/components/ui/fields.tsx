import { Eye, EyeOff } from 'lucide-react'
import { useId, useState, type ComponentProps, type ReactNode } from 'react'
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

/** A password box with a button to show what was typed, so typos are easy to spot. */
export const PasswordField = ({
  label,
  error,
  className,
  ...props
}: FieldProps & Omit<ComponentProps<'input'>, 'type'>) => {
  const id = useId()
  const [visible, setVisible] = useState(false)
  return (
    <FieldShell label={label} error={error} id={id}>
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          className={cn(CONTROL_CLASS, 'h-12 pr-12', className)}
          {...describedBy(id, error)}
          {...props}
        />
        <button
          type="button"
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          onClick={() => setVisible((shown) => !shown)}
          className="absolute inset-y-0 right-0 grid w-12 place-items-center rounded-r-2xl text-muted transition hover:text-cocoa"
        >
          {visible ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
        </button>
      </div>
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
