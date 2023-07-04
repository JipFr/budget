// Import Supabase
import SupabaseClient from '~/util/supabase'

// Import stuff
import { recurringTransactions } from '~/util/recurring'

export const host = 'https://push-api.jipfr.nl'

export async function setPushNotifs(allPayments) {
  // Initial info
  const user = SupabaseClient.auth.user()
  const topic = `krab-${user.id}`

  // Remove all existing notifications
  await fetch(`${host}/remove-notification?topic=${topic}`)

  // Add recurring transactions
  const recurring = recurringTransactions(allPayments)

  await Promise.all(
    recurring.map(async (transaction) => {
      const d = new Date(transaction.newDate)
      d.setHours(7)
      d.setMinutes(0)
      d.setSeconds(0)
      if (d.getTime() < Date.now()) return // Don't return if date is already past

      const split = transaction.description.split('\n')
      const title = encodeURIComponent(
        split.length > 1
          ? `Recurring today: a purchase at ${split[0]}`
          : `Recurring today: ${split[0]}`
      )

      const formatter = new Intl.NumberFormat('nl-NL', {
        style: 'currency',
        currency: 'EUR',
      })

      const euroString = formatter.format(transaction.cents / 100).trim()

      const body = encodeURIComponent(`Happening today: ${euroString}`)

      await fetch(
        `${host}/send-notification?topic=${topic}&title=${title}&body=${body}&at=${d.toISOString()}`
      )
    })
  )
}
