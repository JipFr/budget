import AhLogo from '~/assets/logos/ah.svg?inline'

export const plugin = {
  priority: 10, // Position in queueu
  id: 'example',
  displayName: 'Example plugin',
  icon: AhLogo,
  async init() {
    // Get all required async state here, like tokens
  },
  async main() {
    return await {
      modify: [
        {
          id: 1,
          data: {
            description: 'New description',
          },
        },
      ],
    }
  },
  verifyToken(_token) {
    // ... See AH plugin for example
  },
}
