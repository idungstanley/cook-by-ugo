import { Link } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { CompactFooter } from '@/components/layout/CompactFooter'
import { buttonStyles } from '@/components/ui/button.styles'
import { Container } from '@/components/ui/Container'
import { StatusMessage } from '@/components/ui/StatusMessage'
import { useVerifyEmail } from '@/services/account/account.queries'

export const VerifyEmailPage = ({ token }: { token: string }) => {
  const verify = useVerifyEmail()
  const sent = useRef(false)

  useEffect(() => {
    // Once, even when React runs effects twice in development.
    if (sent.current || !token) return
    sent.current = true
    verify.mutate(token)
  }, [token, verify])

  const goToAccount = (
    <Link to="/account" className={buttonStyles()}>
      Go to your account
    </Link>
  )

  return (
    <>
      <Container className="py-10 md:py-14">
        {verify.isSuccess ? (
          <StatusMessage
            title="Email confirmed"
            body="Thanks. Every order placed with this email now shows in your account."
            action={goToAccount}
          />
        ) : verify.isError || !token ? (
          <StatusMessage
            title="This link has expired"
            body="Sign in and ask for a new confirmation email from your account page."
            action={goToAccount}
          />
        ) : (
          <StatusMessage title="Confirming your email..." />
        )}
      </Container>
      <CompactFooter />
    </>
  )
}
