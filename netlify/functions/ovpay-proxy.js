// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
  if (!event.queryStringParameters.path) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing path' }),
    }
  }

  const headers = {
    'User-Agent': 'OVpay/182452 CFNetwork/1496.0.7 Darwin/23.5.0',
    'content-type': event.headers['content-type'] || 'application/json',
    Authorization: event.headers.authorization,
  }

  const body = event.body
  const url = event.queryStringParameters.path

  let data
  try {
    const method = event.httpMethod.toLowerCase()
    const { got } = await import('got')
    if (method === 'post') {
      data = await got[method](url, {
        headers,
        body,
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
