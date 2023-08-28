const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid')

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
      'Plaid-Version': '2020-09-14',
    },
  },
})

const client = new PlaidApi(configuration)

async function getTransactions({ ACCESS_TOKEN }) {
  let transactions
  let error
  let meta

  const day = 24 * 60 * 60 * 1e3

  function pad(num) {
    return num.toString().padStart(2, '0')
  }

  try {
    const now = new Date()
    const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
      now.getDate()
    )}`
    const monthAgo = new Date(now.getTime() - 30 * day)
    const thirtyDaysAgo = `${monthAgo.getFullYear()}-${pad(
      monthAgo.getMonth() + 1
    )}-${pad(monthAgo.getDate())}`

    const data = (
      await client.transactionsGet({
        access_token: ACCESS_TOKEN,
        start_date: thirtyDaysAgo,
        end_date: today,
      })
    ).data

    // Return the account name
    meta = {
      accountName:
        data.accounts?.[0]?.official_name || data.accounts?.[0]?.name,
      balance: data.accounts?.[0]?.balances?.current,
    }

    // Return the recent transactions
    transactions = [...data.transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  } catch (err) {
    error = err.response.data
  }

  return { transactions, error, meta }
}

async function getInfo({ ACCESS_TOKEN }) {
  const request = {
    access_token: ACCESS_TOKEN,
  }
  let info
  let error
  try {
    const response = await client.itemGet(request)
    info = response.data
  } catch (err) {
    error = err.response.data
  }

  return { info, error }
}

async function createLinkToken(configs) {
  if (process.env.PLAID_REDIRECT_URI !== '') {
    configs.redirect_uri = process.env.PLAID_REDIRECT_URI
  }

  let createTokenResponse
  let error
  try {
    createTokenResponse = await client.linkTokenCreate(configs)
  } catch (err) {
    error = err.response.data
  }

  return { ...createTokenResponse, error }
}

async function exchangePublicToken(publicToken) {
  let exchangeResponse
  let error
  try {
    exchangeResponse = await client.itemPublicTokenExchange({
      public_token: publicToken,
    })
  } catch (err) {
    error = err.response.data
  }

  return {
    ...exchangeResponse,
    error,
  }
}

module.exports = {
  exchangePublicToken,
  createLinkToken,
  getInfo,
  getTransactions,
}
