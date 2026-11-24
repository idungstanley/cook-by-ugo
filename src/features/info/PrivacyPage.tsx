import { useSiteInfo } from '@/services/site/site.queries'
import { InfoPage } from './InfoPage'

/** Update this date whenever the notice below changes. */
const LAST_UPDATED = '24 November 2026'

/**
 * Written for UK GDPR and the Data Protection Act 2018. Have it checked against how the
 * business actually works before relying on it.
 */
export const PrivacyPage = () => {
  const { data: site } = useSiteInfo()
  const email = site?.email ?? 'orders@cookedbyugo.com'

  return (
    <InfoPage
      eyebrow="Privacy"
      title="Your data,"
      accent="kept simple."
      intro={`How Cooked by Ugo uses your personal information. Last updated ${LAST_UPDATED}.`}
    >
      <h2>Who we are</h2>
      <p>
        Cooked by Ugo is a food business in Newcastle upon Tyne. We are the data controller for the
        information you give us on this website. Contact us at{' '}
        <a href={`mailto:${email}`}>{email}</a>.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          Your name, email address and phone number, so we can confirm and deliver your order.
        </li>
        <li>Your delivery address and any delivery note.</li>
        <li>What you order, the notes you add to dishes, and your order history.</li>
        <li>
          Any allergy you tell us about. This is health information, and we only use it to prepare
          your food safely.
        </li>
        <li>
          If you create an account, your login email and password. Passwords are stored scrambled,
          and we can never see them.
        </li>
        <li>Reviews and ratings you choose to leave.</li>
        <li>
          Basic technical information, such as your IP address, to keep the site secure and stop
          abuse.
        </li>
      </ul>
      <p>
        We never see or store your card details. Payments are handled by Stripe, a regulated payment
        provider.
      </p>

      <h2>Why we use it</h2>
      <ul>
        <li>To take, prepare, deliver and support your order, which is our contract with you.</li>
        <li>To keep records the law requires, such as tax records.</li>
        <li>To prevent fraud and keep the site secure, which is in our legitimate interests.</li>
        <li>To send offers by email, only if you said yes. You can unsubscribe at any time.</li>
        <li>To prepare your food safely around an allergy, with your consent.</li>
      </ul>

      <h2>Who we share it with</h2>
      <p>
        Only the companies that help us run the service, under contract and only for that purpose:
      </p>
      <ul>
        <li>Stripe, to take card payments and refunds.</li>
        <li>Brevo, to send order emails.</li>
        <li>MongoDB Atlas, which stores our database.</li>
        <li>Cloudflare and our hosting provider, which run and protect this website.</li>
        <li>Cloudinary, which stores menu photos.</li>
        <li>postcodes.io and our address finder, which receive only the postcode you type.</li>
      </ul>
      <p>
        Some of these companies may process data outside the UK. When they do, they use the legal
        safeguards UK law requires. We never sell your data.
      </p>

      <h2>Cookies and storage</h2>
      <p>
        We do not use advertising or tracking cookies. Your browser stores your basket, and your
        sign-in if you have an account, so the site works between visits. Stripe sets its own
        cookies during payment to prevent fraud.
      </p>

      <h2>How long we keep it</h2>
      <ul>
        <li>Order records: six years, because tax law requires it.</li>
        <li>Your account: until you ask us to delete it.</li>
        <li>Marketing permission: until you unsubscribe.</li>
      </ul>

      <h2>Your rights</h2>
      <p>
        You can ask to see, correct or delete your information, ask us to stop or limit using it,
        withdraw your consent, or get a copy to take elsewhere. Email{' '}
        <a href={`mailto:${email}`}>{email}</a> and we will reply within one month.
      </p>
      <p>
        If you are unhappy with how we handle your data, you can complain to the Information
        Commissioner&apos;s Office at <a href="https://ico.org.uk/make-a-complaint/">ico.org.uk</a>{' '}
        or on 0303 123 1113.
      </p>
    </InfoPage>
  )
}
