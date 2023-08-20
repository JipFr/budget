export function recurringTransactions(allPayments) {
  let now = new Date()
  now = new Date(
    `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`
  )

  const recurringTransactions = allPayments
    .filter((payment) => {
      // Filter it by being a monthly transaction

      const lowercaseCategories = payment.categories.map((category) =>
        category.toLowerCase()
      )

      return (
        lowercaseCategories.includes('maandelijks') ||
        lowercaseCategories.includes('monthly') ||
        lowercaseCategories.includes('yearly') ||
        lowercaseCategories.includes('anually') ||
        lowercaseCategories.includes('jaarlijks') ||
        lowercaseCategories.includes('quarterly') ||
        lowercaseCategories.includes('driemaandelijks')
      )
    })
    .map((payment) => {
      // Map it into a usable format
      const p = Object.assign({}, payment)
      const date = new Date(p.date)

      const lowercaseCategories = payment.categories.map((category) =>
        category.toLowerCase()
      )

      let monthsIntoFuture = 1
      if (
        lowercaseCategories.includes('yearly') ||
        lowercaseCategories.includes('anually') ||
        lowercaseCategories.includes('jaarlijks')
      ) {
        monthsIntoFuture = 12
      } else if (
        lowercaseCategories.includes('quarterly') ||
        lowercaseCategories.includes('driemaandelijks')
      ) {
        monthsIntoFuture = 3
      }

      const expectedMonth = (date.getMonth() + monthsIntoFuture) % 12

      let newDate = date
      newDate.setMonth(newDate.getMonth() + monthsIntoFuture)
      while (newDate.getMonth() > expectedMonth)
        newDate = new Date(newDate.getTime() - 1e3 * 60 * 60 * 24)

      const diff = newDate.getTime() - now.getTime()
      const inXDays = Math.round(diff / (1e3 * 60 * 60 * 24))

      p.date = `${newDate.getFullYear()}-${(newDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${newDate.getDate().toString().padStart(2, '0')}`

      return {
        ...p,
        inXDays,
        newDate,
      }
    })
    .filter((payment) => payment.inXDays >= 0)
    .sort((paymentA, paymentB) => {
      // Sort payments by amount of days left
      return paymentB.inXDays - paymentA.inXDays
    })

  return recurringTransactions
}
