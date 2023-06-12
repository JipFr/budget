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
  const week = 1e3 * 60 * 60 * 24 * 7
  const future = new Date(Date.now() + week)
  const past = new Date(Date.now() - week * 3)

  const request = {
    access_token: ACCESS_TOKEN,
    start_date: past.toLocaleDateString('en-CA'),
    end_date: future.toLocaleDateString('en-CA'),
  }

  let response
  try {
    response = await client.transactionsGet(request)
  } catch (err) {
    console.error(err)
  }
  const data = response.data

  const compareTxnsByDateAscending = (a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  // Return the recent transactions
  const recentlyAdded = [...data.transactions]
    .sort(compareTxnsByDateAscending)
    .slice(-12)
  return { transactions: recentlyAdded }
}

async function createLinkToken(configs) {
  if (process.env.PLAID_REDIRECT_URI !== '') {
    configs.redirect_uri = process.env.PLAID_REDIRECT_URI
  }

  let createTokenResponse
  try {
    createTokenResponse = await client.linkTokenCreate(configs)
  } catch (err) {
    console.log(err)
  }

  return createTokenResponse
}

async function exchangePublicToken(publicToken) {
  let exchangeResponse
  try {
    exchangeResponse = await client.itemPublicTokenExchange({
      public_token: publicToken,
    })
  } catch (err) {
    console.error(err)
  }

  return exchangeResponse
}

module.exports = { getTransactions, createLinkToken, exchangePublicToken }
