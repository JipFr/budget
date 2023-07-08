export function getRedirectUrl() {
  return process.env.NODE_ENV === 'production'
    ? location.href.includes('dev')
      ? 'https://dev--jip-budget.netlify.app/'
      : 'https://krabbijkas.nl/'
    : process.env.REDIRECT_URL || 'http://localhost:8888/'
}
