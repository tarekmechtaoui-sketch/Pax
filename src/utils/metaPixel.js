function safeFbq(...args) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq(...args)
  }
}

export function trackPageView() {
  safeFbq('track', 'PageView')
}

export function trackPurchase(value, currency = 'USD') {
  safeFbq('track', 'Purchase', { value, currency })
}

export function trackLead() {
  safeFbq('track', 'Lead')
}

export function trackContact() {
  safeFbq('track', 'Contact')
}

export function trackAddToCart(value, currency = 'USD') {
  safeFbq('track', 'AddToCart', { value, currency })
}

export function trackInitiateCheckout(value, currency = 'USD') {
  safeFbq('track', 'InitiateCheckout', { value, currency })
}

export function trackCompleteRegistration() {
  safeFbq('track', 'CompleteRegistration')
}

export function trackViewContent(name) {
  safeFbq('track', 'ViewContent', { content_name: name })
}
