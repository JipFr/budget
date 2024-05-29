import { pluginsState } from '../'
import { ovPayFetch, state as ovPayState } from './'

// Import Supabase
import SupabaseClient from '~/util/supabase'

function prettifyLocationName(string) {
  return (string || 'Unknown')
    .replaceAll(', Centraal Station', ' CS')
    .split(',')
    .map((t) => t.trim())
    .reverse()
    .join(', ')
}

async function getTrips(id, authorization) {
  const data = await ovPayFetch(
    `https://api.ovpay.app/api/v3/Trips/${id}?offset=0`,
    {
      headers: {
        Authorization: authorization,
      },
    }
  )
  return data
}

async function getAccounts(authorization) {
  const data = await ovPayFetch(
    'https://api.ovpay.app/api/v1/TransitAccounts',
    {
      headers: {
        Authorization: authorization,
      },
    }
  )
  return data
}

export async function findUpdatesOrInserts() {
  const allTrips = []
  const insert = []
  const modify = []

  await Promise.all(
    ovPayState.tokens.map(async (token) => {
      const authString = `Bearer ${token.access_token}`
      const accounts = await getAccounts(authString)
      await Promise.all(
        accounts.map(async (account) => {
          const trips = await getTrips(account.xtat, authString)
          allTrips.push(...trips.items)
        })
      )
    })
  )

  if (allTrips.length === 0) return { transactions: { insert, modify } }

  const oldestTrip = allTrips[allTrips.length - 1]
  const oldestTripDate = new Date(oldestTrip.trip.checkInTimestamp)

  // Find transactions that came AFTER the oldest receipt so we
  // don't search through every single transaction, every single time
  const day = 1e3 * 60 * 60 * 24
  const transactionsInPeriod = pluginsState.transactions.filter(
    (transaction) => {
      const transactionDate = new Date(transaction.date)
      return transactionDate.getTime() > oldestTripDate.getTime() - day // Add a day of leeway
    }
  )

  const tripsPerDate = {}
  for (const trip of allTrips) {
    const date = trip.trip.checkInTimestamp.split('T')[0]
    if (!tripsPerDate[date]) tripsPerDate[date] = []
    tripsPerDate[date].push(trip)
  }

  // Construct transactions
  for (const [date, transactions] of Object.entries(tripsPerDate)) {
    const transactionBuilder = ['OVPay']
    for (const transaction of transactions) {
      const trip = transaction.trip
      const checkInLocation = prettifyLocationName(trip.checkInLocation)
      const checkOutLocation = prettifyLocationName(trip.checkOutLocation)

      const transport = trip.transport === 'BUS' ? '🚌' : '🚅'

      transactionBuilder.push(
        `${transport} ${checkInLocation} > ${checkOutLocation} €${(
          trip.fare / 100
        ).toFixed(2)}`
      )
    }

    transactionBuilder.push('(imported)')
    const transactionString = transactionBuilder.join('\n')
    const transactionStringClean = transactionBuilder.slice(0, -1).join('\n')

    const transactionsOnDate = transactionsInPeriod.filter((transaction) => {
      // Add 1 day to it, because OVPay only charges a day later
      const day = 1e3 * 60 * 60 * 24
      const dayAfterOv = new Date(new Date(date).getTime() + day)
      return (
        (dayAfterOv.toISOString().split('T')[0] === transaction.date && // Only allow day after for un-editeds
          transaction.description.toLowerCase().includes('www.ovpay')) ||
        new Date(date).toISOString().split('T')[0] === transaction.date
      )
    })
    const ovPayTransaction = transactionsOnDate.find(
      (t) =>
        t.description.toLowerCase().includes('ovpay') ||
        t.description.toLowerCase().includes('nlov')
    )

    const price = transactions.reduce((sum, t) => sum + t.trip.fare, 0) * -1
    if (ovPayTransaction) {
      const unleashed = ovPayTransaction.plugins_unleashed.split(',')
      unleashed.push('ovpay')
      const unleashedString = Array.from(new Set(unleashed)).join(',')

      if (
        (ovPayTransaction.description === transactionString ||
          ovPayTransaction.description === transactionStringClean) &&
        ovPayTransaction.cents === price
      ) {
        // Add OV if it isn't there yet
        if (!ovPayTransaction.categories.includes('ov')) {
          modify.push({
            id: ovPayTransaction.id,
            data: {
              categories: ['ov'],
              plugins_unleashed: unleashedString,
            },
          })
        }
        continue
      }
      modify.push({
        id: ovPayTransaction.id,
        data: {
          description: transactionString,
          cents: price,
          categories: ['ov'],
          date,
          plugins_unleashed: unleashedString,
        },
      })
    } else {
      insert.push({
        data: {
          date,
          description: transactionString,
          cents: price,
          plugin_transaction_id: `ovpay-${date}`,
          plugins_unleashed: 'ovpay',
          user_id: SupabaseClient.auth.user().id,
          categories: ['ov'],
        },
      })
    }
  }

  return {
    transactions: {
      insert,
      modify,
    },
  }
}
