import { state as settingsState } from './settings'

function thisDateNextMonth(d) {
  const date = new Date(d)

  const expectedMonth = (date.getMonth() + 1) % 12

  let newDate = date
  newDate.setMonth(newDate.getMonth() + 1)
  while (newDate.getMonth() > expectedMonth)
    newDate = new Date(newDate.getTime() - 1e3 * 60 * 60 * 24)

  return newDate
}

export function getFoodInfo(payments) {
  const foodTransactions = payments
    .filter((payment) => {
      const categories = payment.categories.map((category) =>
        category.toLowerCase()
      )
      return (
        (categories.includes('food') ||
          categories.includes('eten') ||
          categories.includes('eten aanpassen') ||
          categories.includes('adjust food')) &&
        !categories.includes('exclude')
      )
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  // --
  const positiveTransactions = foodTransactions.filter((payment) => {
    const categories = payment.categories.map((category) =>
      category.toLowerCase()
    )
    return (
      payment.cents > 0 ||
      categories.includes('adjust food') ||
      categories.includes('eten aanpassen')
    )
  })

  const negativeTransactions = foodTransactions.filter((payment) => {
    const categories = payment.categories.map((category) =>
      category.toLowerCase()
    )
    return (
      payment.cents <= 0 &&
      !categories.includes('adjust food') &&
      !categories.includes('eten aanpassen')
    )
  })

  const d = new Date(
    positiveTransactions[positiveTransactions.length - 1]?.date || Date.now()
  )

  const endDate =
    d.getDate() >= settingsState.startDate ? thisDateNextMonth(d) : d
  endDate.setDate(settingsState.startDate)

  // --

  const startDate = new Date(positiveTransactions[0]?.date || Date.now())

  const predictedTotals = []
  let realTotals = []
  let foodDate = new Date(startDate)

  while (foodDate.getTime() < endDate.getTime()) {
    const periodEndDate =
      foodDate.getDate() >= settingsState.startDate
        ? thisDateNextMonth(foodDate)
        : new Date(foodDate)
    periodEndDate.setDate(settingsState.startDate)

    // Find positive transactions on date
    const dateTransactions = positiveTransactions.filter((payment) => {
      const d = new Date(payment.date)
      return (
        d.getFullYear() === foodDate.getFullYear() &&
        d.getMonth() === foodDate.getMonth() &&
        d.getDate() === foodDate.getDate()
      )
    })

    // ! Expected
    let todayPredictedBase =
      predictedTotals[predictedTotals.length - 1]?.cents || 0

    // Add today's transactions
    for (const transaction of dateTransactions) {
      todayPredictedBase += transaction.cents
    }

    // Remove neccesary amount to get to 0 before period's end
    const daysBetween =
      (periodEndDate.getTime() - foodDate.getTime()) / (1e3 * 60 * 60 * 24)
    todayPredictedBase -= todayPredictedBase / daysBetween

    predictedTotals.push({
      cents: todayPredictedBase,
      date: new Date(foodDate),
    })

    foodDate.setDate(foodDate.getDate() + 1)
  }

  // Calculate real totals
  foodDate = new Date(startDate)

  while (foodDate.getTime() < endDate.getTime()) {
    // Find all transactions on date
    const dateTransactions = foodTransactions.filter((payment) => {
      const d = new Date(payment.date)
      return (
        d.getFullYear() === foodDate.getFullYear() &&
        d.getMonth() === foodDate.getMonth() &&
        d.getDate() === foodDate.getDate()
      )
    })

    // ! Expected
    let todayBase = realTotals[realTotals.length - 1]?.cents || 0

    // Add today's transactions
    for (const transaction of dateTransactions) {
      todayBase += transaction.cents
    }

    realTotals.push({
      cents: todayBase,
      date: new Date(foodDate),
    })

    foodDate.setDate(foodDate.getDate() + 1)
  }

  // Remove excesive data from real
  const lastFoodTransaction = foodTransactions[foodTransactions.length - 1]
  realTotals = realTotals.filter(
    (t) =>
      t.date.getTime() <=
        new Date(lastFoodTransaction?.date || Date.now()).getTime() ||
      t.date.getTime() < Date.now()
  )

  // Find how much food budget is available today
  const todayIndex = realTotals.indexOf(
    realTotals.find((d) => {
      const hour = 1e3 * 60 * 60
      const a = new Date(d.date.getTime() + hour) // Stupid timezone stuff
      const b = new Date()
      return a.toISOString().split('T')[0] === b.toISOString().split('T')[0]
    })
  )
  const availableMoneyToday =
    todayIndex !== -1
      ? realTotals[todayIndex].cents - predictedTotals[todayIndex].cents
      : null

  // Find total food budget
  let totalBudget = 0
  let spent = 0
  for (const payment of positiveTransactions) {
    totalBudget += payment.cents
  }
  for (const payment of negativeTransactions) {
    spent += payment.cents * -1
  }

  const remainingBudget = totalBudget - spent

  return {
    realTotals,
    predictedTotals,
    availableMoneyToday,
    totalBudget,
    remainingBudget,
    spent,
  }
}
