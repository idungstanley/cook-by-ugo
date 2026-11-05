import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/fields'
import { cn } from '@/lib/cn'
import { useForgotPassword, useSignIn, useSignUp } from '@/services/account/account.queries'

type Mode = 'sign-in' | 'sign-up' | 'forgot'

const signInSchema = z.object({
  email: z.email('Enter your email'),
  password: z.string().min(1, 'Enter your password'),
})

const signUpSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name'),
  email: z.email('Enter a valid email'),
  password: z.string().min(8, 'Use at least 8 characters'),
  marketingOptIn: z.boolean(),
})

const SignInForm = ({ onForgot }: { onForgot: () => void }) => {
  const signIn = useSignIn()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signInSchema) })

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => signIn.mutate(values))}
      className="flex flex-col gap-4"
    >
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <TextField
        label="Password"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />
      {signIn.error && (
        <p role="alert" className="text-sm font-semibold text-jollof">
          {signIn.error.message}
        </p>
      )}
      <Button type="submit" size="lg" disabled={signIn.isPending}>
        {signIn.isPending ? 'Signing in...' : 'Sign in'}
      </Button>
      <button
        type="button"
        onClick={onForgot}
        className="text-sm font-semibold text-muted underline-offset-2 hover:underline"
      >
        Forgot your password?
      </button>
    </form>
  )
}

const SignUpForm = () => {
  const signUp = useSignUp()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signUpSchema), defaultValues: { marketingOptIn: false } })

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => signUp.mutate(values))}
      className="flex flex-col gap-4"
    >
      <TextField
        label="Full name"
        autoComplete="name"
        error={errors.name?.message}
        {...register('name')}
      />
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <TextField
        label="Password"
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register('password')}
      />
      <label className="flex items-start gap-2.5 text-sm">
        <input type="checkbox" className="mt-0.5 size-4" {...register('marketingOptIn')} />
        Send me offers by email. You can unsubscribe at any time.
      </label>
      {signUp.error && (
        <p role="alert" className="text-sm font-semibold text-jollof">
          {signUp.error.message}
        </p>
      )}
      <Button type="submit" size="lg" disabled={signUp.isPending}>
        {signUp.isPending ? 'Creating your account...' : 'Create account'}
      </Button>
    </form>
  )
}

const ForgotForm = ({ onBack }: { onBack: () => void }) => {
  const forgot = useForgotPassword()
  const [email, setEmail] = useState('')

  if (forgot.isSuccess) {
    return (
      <div className="flex flex-col gap-4">
        <p>If {email} has an account, we have sent a link to choose a new password.</p>
        <Button variant="outline" onClick={onBack}>
          Back to sign in
        </Button>
      </div>
    )
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        forgot.mutate(email)
      }}
      className="flex flex-col gap-4"
    >
      <TextField
        label="Email"
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <Button type="submit" size="lg" disabled={forgot.isPending}>
        Send reset link
      </Button>
      <button
        type="button"
        onClick={onBack}
        className="text-sm font-semibold text-muted underline-offset-2 hover:underline"
      >
        Back to sign in
      </button>
    </form>
  )
}

export const AuthPanel = () => {
  const [mode, setMode] = useState<Mode>('sign-in')

  return (
    <div className="mx-auto w-full max-w-md rounded-card bg-paper p-6 shadow-sm md:p-8">
      {mode === 'forgot' ? (
        <>
          <h1 className="mb-1 text-3xl">Reset your password</h1>
          <p className="mb-5 text-sm text-muted">We will email you a link.</p>
          <ForgotForm onBack={() => setMode('sign-in')} />
        </>
      ) : (
        <>
          <div
            role="tablist"
            aria-label="Account"
            className="mb-6 grid grid-cols-2 rounded-full bg-shea p-1"
          >
            {(['sign-in', 'sign-up'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={mode === tab}
                onClick={() => setMode(tab)}
                className={cn(
                  'h-10 rounded-full text-sm font-bold transition',
                  mode === tab && 'bg-cocoa text-paper',
                )}
              >
                {tab === 'sign-in' ? 'Sign in' : 'Create account'}
              </button>
            ))}
          </div>
          {mode === 'sign-in' ? <SignInForm onForgot={() => setMode('forgot')} /> : <SignUpForm />}
        </>
      )}
    </div>
  )
}
