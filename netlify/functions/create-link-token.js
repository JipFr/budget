const { createLinkToken } = require('../../plaid')

// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
  if (!event.queryStringParameters['user-id']) {
    return {
      statusCode: 400,
      body: JSON.stringify({ body: 'Missing user-id' }),
    }
  }

  const configs = {
    user: {
      // This should correspond to a unique id for the current user.
      client_user_id: event.queryStringParameters['user-id'],
    },
    client_name: 'Krab bij Kas',
    products: ['auth', 'transactions', 'transactions_refresh'],
    country_codes: ['US', 'CA', 'NL'],
    language: 'en',
  }

  const t = await createLinkToken(configs)
  console.log(t)

  return {
    statusCode: 200,
    body: JSON.stringify({ token: t.data.link_token }),
  }
}

module.exports = { handler }
