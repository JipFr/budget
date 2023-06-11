const { exchangePublicToken } = require('../../plaid')

// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
  if (!event.queryStringParameters['public-token']) {
    return {
      statusCode: 400,
      body: JSON.stringify({ body: 'Missing public-token' }),
    }
  }

  const exchange = await exchangePublicToken(
    event.queryStringParameters['public-token']
  )

  return {
    statusCode: 200,
    body: JSON.stringify({ token: exchange.data.access_token }),
  }
}

module.exports = { handler }
