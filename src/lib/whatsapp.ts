export const buildWhatsappUrl = (phoneNumber: string, message?: string) =>
  `https://wa.me/${phoneNumber}${message ? `?text=${encodeURIComponent(message)}` : ''}`
