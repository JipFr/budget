// Import Supabase
import SupabaseClient from '~/util/supabase'

export async function refreshOvPayToken(tokens) {
  const refreshData = await ovPayFetch(
    'https://ovpayidentityprod.b2clogin.com/tfp/ovpayidentityprod.onmicrosoft.com/B2C_1A_ovpay_signup_signin/oauth2/v2.0/token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: 'bba0d876-2f34-4919-a9b9-88d37f559a1e',
        grant_type: 'refresh_token',
        redirect_uri: 'msalbba0d876-2f34-4919-a9b9-88d37f559a1e://auth',
        refresh_token: tokens.refresh_token,
      }),
    }
  )

  if (refreshData.error || !refreshData.access_token) return refreshData

  // Store new access & refresh tokens in DB
  await SupabaseClient.from('plugin_access_tokens')
    .update({
      id: tokens.id,
      ...refreshData,
      updated_at: new Date().toISOString(),
    })
    .match({
      id: tokens.id,
    })

  return {
    ...tokens,
    ...refreshData,
  }
}

export async function addAccessFromCode(code) {
  const res = await ovPayFetch(
    'https://ovpayidentityprod.b2clogin.com/tfp/ovpayidentityprod.onmicrosoft.com/B2C_1A_ovpay_signup_signin/oauth2/v2.0/token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: 'bba0d876-2f34-4919-a9b9-88d37f559a1e',
        grant_type: 'authorization_code',
        redirect_uri: 'msalbba0d876-2f34-4919-a9b9-88d37f559a1e://auth',
        code,
      }),
    }
  )

  // Now logged in
  if (res.error) return { error: res.error }

  const submitObj = {
    user_id: SupabaseClient.auth.user().id,
    access_token: res.access_token,
    refresh_token: res.refresh_token,
    expires_in: res.expires_in,
    plugin: 'ovpay',
    updated_at: new Date().toISOString(),
  }

  // Insert access token
  const insert = await SupabaseClient.from('plugin_access_tokens').insert([
    submitObj,
  ])

  return { res, insert }
}

// General OVPay fetch function
export function ovPayFetch(path, opts, tokens) {
  return fetch(
    `/.netlify/functions/ovpay-proxy?path=${encodeURIComponent(path)}`,
    {
      ...opts,
      body: opts.body,
    }
  ).then((d) => {
    return d.json()
  })
}

export async function getAccounts(authorization) {
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

export async function getName(authorization) {
  // https://api.ovpay.app/api/v1/PassengerAccounts
  const data = await ovPayFetch(
    'https://api.ovpay.app/api/v1/PassengerAccounts',
    {
      headers: {
        Authorization: authorization,
      },
    }
  )
  return data
}
