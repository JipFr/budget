// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
  if (!event.queryStringParameters.path) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing path' }),
    }
  }

  const headers = {
    'User-Agent': 'Appie/8.22.3',
    'content-type': 'application/json',
    Authorization: event.headers.authorization,
  }

  const body = JSON.parse(event.body || '{}')
  const url = `https://api.ah.nl${event.queryStringParameters.path}`

  let data
  try {
    const method = event.httpMethod.toLowerCase()
    const { got } = await import('got')
    if (method === 'post') {
      data = await got[method](url, {
        headers,
        json: {
          clientId: 'appie',
          ...body,
        },
      }).json()
    } else {
      data = await got[method](url, { headers }).json()
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.toString() || 'Invalid request' }),
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  }
}

module.exports = { handler }
