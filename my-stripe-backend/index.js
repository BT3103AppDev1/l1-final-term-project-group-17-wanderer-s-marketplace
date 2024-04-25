const express = require('express');
const bodyParser = require('body-parser');
const Stripe = require('stripe');
const cors = require('cors');

// Initialize the Stripe library with your secret key
const stripe = Stripe('sk_test_51P6wEnESKHXx7boldeaqhaZxdn0GAqzlMYKTlDuoVnFA33xTpfZi49w4CH1I0TNTwhLYCLDkheuwdcxB2OwpILA300POteG6pA'); // Use your Stripe secret key

const app = express();

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://wanderer-s-marketplace.web.app'   // Your local dev environment
    // You can add more domains here
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // required to pass
  allowedHeaders: 'Content-Type, Authorization, X-Requested-With',
};


app.use(cors(corsOptions)); // This will enable CORS for all routes and origins
app.use(bodyParser.json());

// Enable CORS for your frontend domain

// Create a new price for a product in stripe
app.post('/create-price', async (req, res) => {
  const { amount, currency, listingName } = req.body;

  try {
    // Create a new product for the price
    const product = await stripe.products.create({ name: listingName });

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

//creates a stripe checkout session which returns a sessionId that will be used to be redirected to a checkout page
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
        success_url: `https://wanderer-s-marketplace.web.app/payment-success?session_id={CHECKOUT_SESSION_ID}&offerId=${offerId}`,  // Replace with your success URL
        cancel_url: 'https://wanderer-s-marketplace.web.app/payment-failure', 
      });
  
      res.json({ sessionId: session.id });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: error.message });
    }
  });


  //this endpoint performs a stripe transfer by paying out the traveller after the shopper receives their purchase
  app.post('/payout-seller', async (req, res) => {
    const { offerPrice, sellerStripeAccountId } = req.body;
  
    try {
      const transfer = await stripe.transfers.create({
        amount: offerPrice * 100,
        currency: 'sgd',
        destination: sellerStripeAccountId,
      });
  
      res.json({ success: true, transferId: transfer.id });
    } catch (error) {
      console.error('Error creating transfer:', error);
      res.status(500).json({ error: error.message });
    }
  });

  //this endpoint creates a stripe connected account
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
            company: {
            },
            individual: {
            },
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
        });

        return res.json({ accountId: account.id });
    } catch (error) {
        console.error('Error creating Stripe account:', error);
        return res.status(500).json({ error: error.message });
    }
});

//this endpoint checks that the stripeAccountId of a user is a valid userId
app.get('/check-stripe-account/:accountId', async (req, res) => {
    const accountId = req.params.accountId;
    
    try {
      const account = await stripe.accounts.retrieve(accountId);
      res.json({ isValid: true, account });
    } catch (error) {
      res.status(400).json({ isValid: false, error: error.message });
    }
  });

//this endpoint generates a stripe connected account verification link for user to verify their info
app.post('/create-account-link', async (req, res) => {
    const { accountId, refreshUrl, returnUrl } = req.body;
  
    if (!accountId) {
      return res.status(400).json({ error: 'Account ID is required' });
    }

  
    try {
      const accountLink = await stripe.accountLinks.create({
        account: accountId,
        refresh_url: "https://wanderer-s-marketplace.web.app/home", // The URL to redirect the user if they are disconnected. 
        return_url: "https://wanderer-s-marketplace.web.app/",   // The URL to redirect the user after they have completed the onboarding process.
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
