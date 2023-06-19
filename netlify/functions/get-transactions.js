const { getTransactions } = require('../../plaid')

// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
  if (!event.queryStringParameters['access-token']) {
    return {
      statusCode: 400,
      body: JSON.stringify({ body: 'Missing access-token' }),
    }
  }

  const { transactions } = await getTransactions({
    ACCESS_TOKEN: event.queryStringParameters['access-token'],
  })

  return {
    statusCode: 200,
    body: JSON.stringify({ transactions }),
  }
}

module.exports = { handler }
