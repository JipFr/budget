// Import Supabase
import SupabaseClient from '~/util/supabase'

export async function exchangeToken(publicToken) {
  const tokenExchangeRes = await fetch(
    `/.netlify/functions/exchange-public-token?public-token=${publicToken}`
  ).then((d) => d.json())

  const submitObj = {
    user_id: SupabaseClient.auth.user().id,
    access_token: tokenExchangeRes.token,
    plugin: 'plaid',
  }

  // Insert access token
  await SupabaseClient.from('plugin_access_tokens').insert([submitObj])
}

export function addPlaidAccount() {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    const user = SupabaseClient.auth.user()

    // Request link token
    const linkTokenRes = await fetch(
      `/.netlify/functions/create-link-token?user-id=${user.id}`
    ).then((d) => d.json())

    // Init Plaid Link
    // eslint-disable-next-line no-undef
    const { open } = Plaid.create({
      token: linkTokenRes.token,
      onSuccess: async (publicToken) => {
        await exchangeToken(publicToken)
        resolve()
      },
      onExit: () => {
        resolve()
      },
    })

    open()
  })
}
