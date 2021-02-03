export const state = () => ({
  data: {
    transactions: [],
    transactionsInPeriod: [],
    loading: true,
  },
  tagColors: {},
  from: '2019-01-01',
  until: '2022-01-01',
})

function applyFilter(state) {
  // Get "from" and "until" and make it so every transaction date under it
  const fromDate = new Date(state.from)
  const untilDate = new Date(state.until)
  const hour = 1e3 * 60 * 60

  // Filter transactions by date
  state.data.transactionsInPeriod = state.data.transactions.filter((v) => {
    const d = new Date(v.date)
    return (
      d.getTime() >= fromDate.getTime() - hour &&
      d.getTime() <= untilDate.getTime() + hour
    )
  })

  // Assign color for each tag
  // Get unique tags
  const allTags = [
    ...new Set(
      state.data.transactions
        .map((v) => v.categories.map((v) => v.trim().toLowerCase()))
        .flat()
    ),
  ]

  // Fixed colors
  const colors = [
    'rgb(0, 122, 255)',
    'rgb(52, 199, 89)',
    'rgb(255, 149, 0)',
    'rgb(88, 86, 214)',
    'rgb(255, 45, 85)',
    'rgb(175, 82, 222)',
    'rgb(255, 59, 48)',
    'rgb(90, 200, 250)',
    'rgb(255, 204, 0)',
  ]

  // Assign color to each tag
  // const fullRange = 360
  for (const [i, name] of Object.entries(allTags)) {
    // const c = (Number(i) / allTags.length) * fullRange
    // state.tagColors[name] = `hsl(${c}, 100%, 50%)`
    state.tagColors[name] = colors[i % colors.length]
  }
}

export const mutations = {
  set(state, data) {
    // We might need to add other values here later
    // Setting the entire object breaks reactivity
    state.data.transactions = data.transactions
    state.data.loading = false
    applyFilter(state)
  },
  setFrom(state, newFrom) {
    state.from = newFrom
    applyFilter(state)
  },
  setUntil(state, newUntil) {
    state.until = newUntil
    applyFilter(state)
  },
}
