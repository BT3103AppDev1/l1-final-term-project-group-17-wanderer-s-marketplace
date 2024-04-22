const express = require('express');
const bodyParser = require('body-parser');
const Stripe = require('stripe');
const cors = require('cors');

// Initialize the Stripe library with your secret key
const stripe = Stripe('sk_test_51P6wEnESKHXx7boldeaqhaZxdn0GAqzlMYKTlDuoVnFA33xTpfZi49w4CH1I0TNTwhLYCLDkheuwdcxB2OwpILA300POteG6pA'); // Use your Stripe secret key

const app = express();

const corsOptions = {
  origin: [
    'http://localhost:5173',   // Your local dev environment
    // You can add more domains here
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // required to pass
  allowedHeaders: 'Content-Type, Authorization, X-Requested-With',
};


app.use(cors(corsOptions)); // This will enable CORS for all routes and origins
app.use(bodyParser.json());

// Enable CORS for your frontend domain

// Create a new price for a product
app.post('/create-price', async (req, res) => {
  const { amount, currency } = req.body;

  try {
    // Create a new product for the price
    const product = await stripe.products.create({ name: 'Dynamic Product' });

    // Create a new price with the given amount and currency for the created product
    const price = await stripe.prices.create({
      unit_amount: amount * 100, // Convert amount to cents
      currency: currency,
      product: product.id,
    });

    res.json({ priceId: price.id });
  } catch (error) {
    console.error('Error creating price:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/create-checkout-session', async (req, res) => {
    try {
      const { priceId, offerId } = req.body;   // Assume a price ID is passed from the client
      console.log('Received priceId:', priceId);
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price: priceId,  // Use the dynamic price ID created previously
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}&offerId=${offerId}`,  // Replace with your success URL
        cancel_url: 'https://example.com/cancel',    // Replace with your cancel URL
      });
  
      res.json({ sessionId: session.id });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/payout-seller', async (req, res) => {
    const { offerPrice, sellerStripeAccountId } = req.body;  // Replace with actual variable names
  
    try {
      const transfer = await stripe.transfers.create({
        amount: offerPrice * 100,
        currency: 'sgd',
        destination: sellerStripeAccountId,
        // Optionally add: transfer_group, description, and other metadata
      });
  
      res.json({ success: true, transferId: transfer.id });
    } catch (error) {
      console.error('Error creating transfer:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/create-stripe-account', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const account = await stripe.accounts.create({
            type: 'express',
            country: 'SG',  // Specify the country code
            email: email,
            business_type: "individual",
            business_profile: {
              url: 'https://canvas.nus.edu.sg',
              product_description: 'College, Uni, Professional Schools', // This is an assumption. You may need to change the field according to Stripe's expected structure
            //   industry:'College, Uni, Professional Schools'
            },
            // tos_acceptance: {
            //     date: null,
            //     ip: null,
            //     user_agent: null
            // },
            company: {
              // Add other company details that Stripe requires
            },
            individual: {
              // Add individual representative's details that Stripe requires
            },
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
            // Additional settings can be added here as needed, such as business type or tos acceptance
        });

        return res.json({ accountId: account.id });
    } catch (error) {
        console.error('Error creating Stripe account:', error);
        return res.status(500).json({ error: error.message });
    }
});
app.get('/check-stripe-account/:accountId', async (req, res) => {
    const accountId = req.params.accountId;
    
    try {
      const account = await stripe.accounts.retrieve(accountId);
      res.json({ isValid: true, account });
    } catch (error) {
      res.status(400).json({ isValid: false, error: error.message });
    }
  });

app.post('/create-account-link', async (req, res) => {
    const { accountId, refreshUrl, returnUrl } = req.body;
  
    if (!accountId) {
      return res.status(400).json({ error: 'Account ID is required' });
    }

  
    try {
      const accountLink = await stripe.accountLinks.create({
        account: accountId,
        refresh_url: "http://localhost:5173/home", // The URL to redirect the user if they are disconnected. 
        return_url: "http://localhost:5173/",   // The URL to redirect the user after they have completed the onboarding process.
        type: 'account_onboarding',
      });
      
      return res.json({ url: accountLink.url });
    } catch (error) {
      console.error('Error creating account link:', error);
      return res.status(500).json({ error: error.message });
    }
  });
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
