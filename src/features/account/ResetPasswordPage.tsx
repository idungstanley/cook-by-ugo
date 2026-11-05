import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { CompactFooter } from '@/components/layout/CompactFooter'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { TextField } from '@/components/ui/fields'
import { useResetPassword } from '@/services/account/account.queries'

export const ResetPasswordPage = ({ token }: { token: string }) => {
  const reset = useResetPassword()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const tooShort = password.length > 0 && password.length < 8

  return (
    <>
      <Container className="py-10 md:py-14">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            reset.mutate(
              { token, password },
              { onSuccess: () => void navigate({ to: '/account' }) },
            )
          }}
          className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-card bg-paper p-6 shadow-sm md:p-8"
        >
          <h1 className="text-3xl">Choose a new password</h1>
          <TextField
            label="New password"
            type="password"
            autoComplete="new-password"
            value={password}
            error={tooShort ? 'Use at least 8 characters' : undefined}
            onChange={(event) => setPassword(event.target.value)}
          />
          {reset.error && (
            <p role="alert" className="text-sm font-semibold text-jollof">
              {reset.error.message}
            </p>
          )}
          <Button type="submit" size="lg" disabled={password.length < 8 || reset.isPending}>
            Save and sign in
          </Button>
        </form>
      </Container>
      <CompactFooter />
    </>
  )
}
