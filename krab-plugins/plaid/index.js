import PlaidLogo from '~/assets/logos/plaid.svg?inline'

export const plugin = {
  priority: 1, // Position in queueu
  id: 'plaid',
  displayName: 'Plaid',
  icon: PlaidLogo,
  init() {
    // Get all required async state here, like tokens
  },
  main() {
    return {}
  },
  verifyToken(_token) {
    // ... See AH plugin for example
  },
}
