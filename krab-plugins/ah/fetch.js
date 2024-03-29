// Import Supabase
import SupabaseClient from '~/util/supabase'

export async function refreshAhToken(tokens) {
  const refreshData = await fetch(
    `/.netlify/functions/ah-proxy?path=${encodeURIComponent(
      '/mobile-auth/v1/auth/token/refresh'
    )}`,
    {
      method: 'POST',
      body: JSON.stringify({
        clientId: 'appie',
        refreshToken: tokens.refresh_token,
      }),
    }
  ).then((d) => d.json())

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
  const res = await ahFetch('/mobile-auth/v1/auth/token', {
    method: 'POST',
    body: {
      code,
    },
  })

  // Now logged in
  if (res.error) return { error: res.error }

  const submitObj = {
    user_id: SupabaseClient.auth.user().id,
    access_token: res.access_token,
    refresh_token: res.refresh_token,
    expires_in: res.expires_in,
    plugin: 'ah',
    updated_at: new Date().toISOString(),
  }

  // Insert access token
  const insert = await SupabaseClient.from('plugin_access_tokens').insert([
    submitObj,
  ])

  return { res, insert }
}

// General Albert Heijn fetch function
export function ahFetch(path, opts, tokens) {
  return fetch(
    `/.netlify/functions/ah-proxy?path=${encodeURIComponent(path)}`,
    {
      ...opts,
      headers: {
        ...(opts.headers || {}),
        Authorization: tokens ? `Bearer ${tokens.access_token}` : undefined,
      },
      body: JSON.stringify(opts.body),
    }
  ).then((d) => {
    return d.json()
  })
}

export async function getReceipts(token) {
  const receipts = await ahFetch('/mobile-services/v1/receipts', {}, token)
  return receipts
}

export async function getReceipt(token, receiptId) {
  let ahCache = JSON.parse(localStorage.getItem('ah-receipts') || '{}')
  if (ahCache[receiptId]) return ahCache[receiptId]

  const receiptDetails = await ahFetch(
    `/mobile-services/v1/receipts/${receiptId}`,
    {},
    token
  )

  ahCache = JSON.parse(localStorage.getItem('ah-receipts') || '{}')
  ahCache[receiptId] = receiptDetails
  localStorage.setItem('ah-receipts', JSON.stringify(ahCache))

  return receiptDetails
}
