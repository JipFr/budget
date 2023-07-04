import { main as pluginsMain, pluginsState } from '../krab-plugins'

// Fixed colors
export const colors = [
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

export const state = () => {
  return {
    data: {
      transactions: [],
      transactionsInPeriod: [],
      inventory: [],
      recipes: [],
      loading: true,
    },
    loadingPlaid: true,
    tagColors: {},
    // Get day 2 days before the start of the current month
    // Not great code, but oh well....
    from: '2000-01-01',
    until: '2000-01-01',
    viewingCat: '',
  }
}

function applyFilter(state) {
  // Get "from" and "until" and make it so every transaction date under it
  const fromDate = new Date(state.from)
  const untilDate = new Date(state.until)
  const hour = 1e3 * 60 * 60

  state.data.transactions = state.data.transactions.map((t) => {
    // Sometimes browsers act stupid, and because of that we need to get rid of stupidness.
    // This is a very specific scenario I've only run into once, but I refuse to run into it again!
    t.description = t.description.replace(/’/g, "'")
    return t
  })

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
  let allTags = state.data.transactions
    .map((v) => v.categories.map((v) => v.toString().trim().toLowerCase()))
    .flat()

  allTags = [
    ...new Set([
      ...allTags,
      'other',
      'groceries',
      'food',
      'monthly',
      'entertainment',
      'stock',
    ]),
  ] // Remove duplicates, also include 'other'

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
    if (data.transactions) state.data.transactions = data.transactions
    if (data.inventory) state.data.inventory = data.inventory
    if (data.recipes) state.data.recipes = data.recipes

    if (typeof data.transactions !== 'undefined') {
      // Init plugins
      pluginsState.transactions = data.transactions
      pluginsMain()
    }

    state.data.loading = false
    applyFilter(state)
  },
  setLoading(state, bool) {
    state.data.loading = bool
  },
  setFrom(state, newFrom) {
    state.from = newFrom
    applyFilter(state)
  },
  setUntil(state, newUntil) {
    state.until = newUntil
    applyFilter(state)
  },
  setViewing(state, catName) {
    state.viewingCat = catName
  },
  setLoadingPlaid(state, loadingState) {
    state.loadingPlaid = loadingState
  },
}
