export const plugin = {
  priority: 10, // Position in queueu
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
}
