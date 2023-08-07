import { state as settingsState } from '~/util/settings'

export function getSplitter() {
  const formatter = new Intl.NumberFormat(
    settingsState.currency.countryCode ?? 'en-US',
    {
      style: 'currency',
      currency: settingsState.currency.code,
    }
  )
  const str = formatter.format(0).trim()
  const splitter = str.includes('.') ? '.' : ','

  return splitter
}
