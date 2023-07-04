import Vue from 'vue'

import SupabaseClient from '~/util/supabase'

export const currenciesArray = [
  {
    symbol: '$',
    code: 'USD',
    name: 'Dollars',
    nameFull: 'US Dollars',
    countryCode: 'en-US',
  },
  {
    symbol: '€',
    code: 'EUR',
    name: 'Euros',
    nameFull: 'Euros',
    countryCode: 'nl-NL',
  },
  {
    symbol: '£',
    code: 'GBP',
    name: 'Pounds',
    nameFull: 'British Pounds',
    countryCode: 'en-GB',
  },
  {
    symbol: '$',
    code: 'CAD',
    name: 'Canadian Dollars',
    nameFull: 'Canadian Dollars',
    countryCode: 'en-CA',
  },
]
export const currencies = `[${currenciesArray.map((t) => t.symbol).join('|')}}]`

export const state = Vue.observable({
  loaded: false,
  startDate: 10,
  // currency: {
  //   symbol: '€',
  //   code: 'EUR',
  //   name: 'Euros',
  //   countryCode: 'nl-NL',
  // },
  currency: currenciesArray[1],
})

export async function loadSettings() {
  const settings = (await SupabaseClient.from('user_settings').select('*')).data

  // Start date
  const startDate = settings.find((s) => s.settings_key === 'startDate')
  if (startDate) state.startDate = Number(startDate.settings_value)

  const currency = settings.find((s) => s.settings_key === 'currency')
  if (currency)
    state.currency = currenciesArray.find(
      (c) => c.code === currency.settings_value
    )

  state.loaded = true
}

export async function setSetting(key, value) {
  // Upsert wouldn't work so...

  // Check if setting exists
  const existingSetting = await SupabaseClient.from('user_settings')
    .select('*')
    .match({
      user_id: SupabaseClient.auth.user().id,
      settings_key: key,
    })

  let res

  // Update or insert, depending on if the setting already exists
  if (existingSetting.data.length) {
    res = await SupabaseClient.from('user_settings')
      .update({
        settings_value: value,
      })
      .match({
        user_id: SupabaseClient.auth.user().id,
        settings_key: key,
      })
  } else {
    res = await SupabaseClient.from('user_settings').insert({
      user_id: SupabaseClient.auth.user().id,
      settings_key: key,
      settings_value: value,
    })
  }

  await loadSettings()
  return { res }
}
