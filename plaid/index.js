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
  // const request = {
  //   access_token: ACCESS_TOKEN,
  // }
  // try {
  //   const response = await client.itemGet(request)
  //   console.log(response.data)
  // } catch (error) {
  //   // handle error
  // }

  // let refreshData
  // try {
  //   refreshData = await client.transactionsRefresh({
  //     access_token: ACCESS_TOKEN,
  //     client_id: process.env.PLAID_CLIENT_ID,
  //     secret: process.env.PLAID_SECRET,
  //   })
  //   console.log(refreshData)
  // } catch (err) {
  //   console.log(err)
  // }

  // Set cursor to empty to receive all historical updates
  let cursor = null

  // New transaction updates since "cursor"
  let added = []
  let modified = []
  // Removed transaction ids
  let removed = []
  let hasMore = true
  // Iterate through each page of new transaction updates for item
  while (hasMore) {
    const request = {
      access_token: ACCESS_TOKEN,
      cursor,
    }
    let response
    try {
      response = await client.transactionsSync(request)
    } catch (err) {
      console.error(err)
      hasMore = false
      continue
    }

    const data = response.data
    // Add this page of results
    added = added.concat(data.added)
    modified = modified.concat(data.modified)
    removed = removed.concat(data.removed)
    hasMore = data.has_more
    // Update cursor to the next cursor
    cursor = data.next_cursor
  }

  // Return the recent transactions
  const recentlyAdded = [...added]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 12)

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
