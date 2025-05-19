// Enable CORS for all routes
const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  return await fn(req, res);
};

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.COINBASE_COMMERCE_API_KEY;
    const apiUrl = 'https://api.commerce.coinbase.com/charges';

    if (!apiKey) {
      return res.status(400).json({ error: 'Missing Coinbase API key' });
    }

    let payload;
    try {
      payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch (e) {
      return res.status(400).json({ error: 'Invalid JSON in request body' });
    }

    // Compose the charge payload
    const chargePayload = {
      name: payload.name || 'Document Payment',
      description: payload.description || 'Payment for document',
      pricing_type: 'fixed_price',
      local_price: {
        amount: String(payload.amount || '1'),
        currency: payload.currency || 'USDC',
      },
      metadata: payload.metadata || {},
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CC-Api-Key': apiKey,
        'X-CC-Version': '2018-03-22',
      },
      body: JSON.stringify(chargePayload),
    });

    let data;
    try {
      data = await response.json();
    } catch (jsonErr) {
      return res.status(500).json({ error: 'Invalid JSON from Coinbase Commerce' });
    }

    if (response.status === 201 && data && data.data && data.data.id) {
      // Return only the chargeId as required by OnchainKit
      return res.status(201).json({ id: data.data.id });
    } else {
      return res.status(response.status).json({ 
        error: (data.error && typeof data.error === 'string') ? data.error : JSON.stringify(data),
      });
    }

  } catch (error) {
    console.error('Charge error:', error);
    return res.status(500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
};

// Apply CORS to our handler
export default allowCors(handler);
