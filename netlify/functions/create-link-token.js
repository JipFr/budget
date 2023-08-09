const { createLinkToken } = require('../../krab-plugins/plaid/plaid')

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
    client_name: 'Krab Bij Kas',
    products: ['transactions'],
    country_codes: ['US', 'CA', 'NL'],
    language: 'en',
  }

  const t = await createLinkToken(configs)

  return {
    statusCode: 200,
    body: JSON.stringify({ token: t.data.link_token, error: t.error }),
  }
}

module.exports = { handler }
