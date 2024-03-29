import { loadSettings, state as settingsState } from './settings'

export async function getDefaultDates() {
  const day = 1e3 * 60 * 60 * 24
  const d = new Date()

  // Load settings
  await loadSettings()
  const startDate = settingsState.startDate

  // Find last month's "23rd" and this month's "23rd"
  // We're treating the 23rd as the start of the month — that's when I get paid.
  const currentMonth23rd = new Date(d)
  currentMonth23rd.setDate(startDate)
  currentMonth23rd.setHours(3)
  currentMonth23rd.setMinutes(0)

  const lastMonth23rd = new Date(
    new Date(d.getFullYear(), d.getMonth()).getTime() - day * 0.75 // This is a bit whack, but TIMEZONES!
  )
  lastMonth23rd.setDate(startDate)

  const fromDate =
    Date.now() > currentMonth23rd.getTime() ? currentMonth23rd : lastMonth23rd

  return {
    from: fromDate,
    until: new Date(),
  }
}
