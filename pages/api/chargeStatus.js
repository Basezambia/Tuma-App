// Next.js API route for checking Coinbase Commerce charge status
export default async function handler(req, res) {
  try {
    // Validate HTTP method
    if (req.method !== "GET") {
      return res.status(405).json({
        error: "Method not allowed",
        message: "Only GET method is supported"
      });
    }

    const { chargeId } = req.query || {};
    const apiKey = process.env.COINBASE_COMMERCE_API_KEY;

    // Validate chargeId parameter
    if (!chargeId) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Missing required parameter: chargeId"
      });
    }

    // Validate API key
    if (!apiKey) {
      return res.status(500).json({
        error: "Server Error",
        message: "Server configuration error. Please contact support."
      });
    }

    // Make request to Coinbase Commerce API
    let response;
    try {
      response = await fetch(`https://api.commerce.coinbase.com/charges/${chargeId}`, {
        method: "GET",
        headers: {
          "X-CC-Api-Key": apiKey,
          "X-CC-Version": "2018-03-22",
          "Accept": "application/json",
        },
      });
    } catch (err) {
      console.error('Network error when calling Coinbase Commerce API:', err);
      return res.status(503).json({
        error: "Service Unavailable",
        message: "Unable to connect to payment service. Please try again later."
      });
    }

    // Parse response
    let data;
    try {
      data = await response.json();
    } catch (err) {
      console.error('Failed to parse Coinbase Commerce API response:', err);
      return res.status(502).json({
        error: "Bad Gateway",
        message: "Received invalid response from payment service"
      });
    }

    if (!response.ok) {
      return res.status(response.status).json({
        error: "API Error",
        message: data.error || data.message || 'Unknown error',
        details: data
      });
    }

    // Return the charge data to the client
    return res.status(200).json(data);
  } catch (err) {
    console.error('Unexpected error in charge status API:', err);
    return res.status(500).json({ error: err.message });
  }
}
