import type { ReactNode } from 'react'
import { Button } from './Button'

interface StatusMessageProps {
  title: string
  body?: string
  action?: ReactNode
}

export const StatusMessage = ({ title, body, action }: StatusMessageProps) => (
  <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
    <h3 className="text-2xl">{title}</h3>
    {body && <p className="max-w-md text-muted">{body}</p>}
    {action}
  </div>
)

export const ErrorMessage = ({ onRetry }: { onRetry: () => void }) => (
  <StatusMessage
    title="We could not load this"
    body="Please check your connection and try again."
    action={<Button onClick={onRetry}>Try again</Button>}
  />
)
