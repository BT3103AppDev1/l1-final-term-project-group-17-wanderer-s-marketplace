<template>
    <div class="payment-failure-container">
      <h1>Payment Failed</h1>
      <p>We're sorry, but there was a problem processing your payment. Please try again.</p>
      <button 
        @click="redirectToHome" 
        class="home-button"
      >
        Go to Home Page
      </button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'PaymentFailure',
    methods: {
      redirectToHome() {
        this.$router.push('/home');
      }
    }
  };
  </script>
  
  <style>
    .payment-failure-container {
    display: flex;
    flex-direction: column;
    justify-content: center; /* Aligns children vertically in the center */
    align-items: center; /* Aligns children horizontally in the center */
    max-width: 600px;
    height: 200px; /* Set a fixed height or minimum height as per your design needs */
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #f9f9f9;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Optional: adds a subtle shadow for depth */
    }
    
    .payment-failure-container h1 {
    margin: 0; /* Remove default margins to ensure centering */
    color: #d9534f; /* Red color for error */
    }
    
    .payment-failure-container p {
    text-align: center;
    color: #333;
    margin-top: 10px; /* Add a little space above the paragraph */
    }
  
    .home-button {
    padding: 10px 20px;
    font-size: 16px;
    color: white;
    background-color: #051e55;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 20px; /* Space above the button */
    }
  
  .home-button:hover {
    background-color: #063a7d;
  }
  </style>