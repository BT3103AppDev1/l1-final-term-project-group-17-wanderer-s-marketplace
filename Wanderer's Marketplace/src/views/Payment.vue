<template>
  <div class="product-name-header">
		<h1>{{ productDetails.name }}</h1>
	</div>
	<div class="payment-container">
		<div class="left">
			<ProductImage :imageSrc="productDetails.imageUrl" />
		</div>
		<div class="right">
			<div class="price-container">
				<h2>${{ offerPrice }}</h2>
				<button class="pay-button" @click="processPayment">Pay</button>
			</div>
		</div>
	</div>
</template>

<script>
import ProductImage from "../components/listing_components/ProductImage.vue";
import ProductDetailsViewing from "../components/listing_components/ProductDetailsViewing.vue";
import firebaseApp from '@/firebase.js';
import { getFirestore, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
const db = getFirestore(firebaseApp);
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getStorage, ref as storageRef, deleteObject } from 'firebase/storage';
import { mapState } from 'vuex';
import { loadStripe } from '@stripe/stripe-js';
import { StripeCheckout } from '@vue-stripe/vue-stripe';

export default {
  name: "Payment",
  components: { ProductImage, ProductDetailsViewing, StripeCheckout },
  props: {
  },
  data() {
    return {
      productDetails: {},
      offerPrice: null,
      stripePromise: null,
      stripeOptions: {
        pk: "pk_test_51P6wEnESKHXx7bolEjhOMLwFY2QlY6IS8plTEgXh0060tnO37z\
		Qac6wR4OWMXSgRTOSkLu3ijPOXaP8fNf6GNESP00XUfvdzwB", // Replace with your Stripe public key
        successUrl: window.location.origin + "/success",
        cancelUrl: window.location.origin + "/cancel",
      },
    };
  },
  created() {
	this.stripePromise = loadStripe(this.stripeOptions.pk);
    this.fetchOfferDetails();
  },

	computed: {
		...mapState(['currentListing', 'user']),
		productDetails() {
		// Use the currentListing from Vuex as the product details
		// or return a default object structure if currentListing is null/undefined
		console.log("currlisting", this.currentListing)
		return this.currentListing || {
			id: "",
			name: "Loading...",
			quantity: 0,
			color: "",
			size: "",
			currency: "",
			minPrice: 0,
			maxPrice: 0,
			deliveryDate: "",
			country: "",
			listingStatus: "Available"
		};
		}
  },
  methods: {
	async createStripePrice() {
    try {
      const response = await fetch('https://bt3103clone.vercel.app/create-price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: this.offerPrice, // Assume offerPrice is a dollar amount
          currency: 'sgd', // or any other currency
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.priceId;
    } catch (error) {
      console.error('Error creating Stripe price:', error);
      throw error;
    }
  },
    async fetchOfferDetails() {
      const offerId = this.$route.params.offerId; // Retrieve the offerId from the route parameters
      if (!offerId) {
        console.error("Offer ID is undefined");
        return;
      }
      
      // Use the offerId to fetch offer details
      const db = getFirestore(firebaseApp);
      const offerDocRef = doc(db, "Offers", offerId);

      try {
        const offerDoc = await getDoc(offerDocRef);
        if (offerDoc.exists()) {
          const offerData = offerDoc.data();
          this.offerPrice = offerData.OfferPrice;
          this.fetchProductDetails(offerData.ListingID);
        } else {
          console.error("No such offer found!");
        }
      } catch (error) {
        console.error("Error fetching offer details:", error);
      }
    },
	async fetchProductDetails(listingId) {
		const db = getFirestore(firebaseApp);
		const listingDocRef = doc(db, "Listings", listingId);

		try {
			const listingDoc = await getDoc(listingDocRef);
			if (listingDoc.exists()) {
				this.productDetails = listingDoc.data();
				this.listingId = listingId;
			} else {
				console.error("No such listing found!");
			}
		} catch (error) {
			console.error("Error fetching listing details:", error);
		}
	},
	async processPayment() {
		// Here you would have your logic to process the payment
		const priceId = await this.createStripePrice();
		const offerId = this.$route.params.offerId;

		const response = await fetch('https://bt3103clone.vercel.app/create-checkout-session', {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json',
			},
			body: JSON.stringify({
			priceId: priceId,  // Use the price ID from earlier
			offerId: offerId, 
			}),
		});

		const { sessionId } = await response.json();
		const stripe = await this.stripePromise;

		// Redirect to the Checkout page hosted by Stripe
		await stripe.redirectToCheckout({
			sessionId: sessionId,
		}).then((result) => {
			if (result.error) {
			alert(result.error.message);
			}
  });
    

		// Fetch the offer document to get the associated listing ID
		const offerDocRef = doc(getFirestore(firebaseApp), "Offers", offerId);
		getDoc(offerDocRef).then((offerDoc) => {
		if (!offerDoc.exists()) {
			console.error("No such offer found!");
			return;
		}

		// Extract listing ID from the offer document
		const listingId = offerDoc.data().ListingID;
		const listingDocRef = doc(getFirestore(firebaseApp), "Listings", listingId);

		// Update the listing's status to "Accepted"
		updateDoc(listingDocRef, {
			ListingStatus: "Accepted"
		}).then(() => {
			console.log(`Offer ${offerId} accepted and listing ${listingId} updated to Accepted.`);
			alert(`Payment successful and offer accepted!`);
			// Here you would probably also want to navigate to a success page or update the state
		}).catch((error) => {
			console.error("Error updating listing status:", error);
			alert("There was an issue with processing the payment.");
		});

		}).catch((error) => {
		console.error("Error fetching offer details:", error);
		});
		this.$router.push('/home');
  }
}
};
</script>

<style scoped>
.payment-container {
	display: flex;
	justify-content: center;
	align-items: flex-start;
	height: calc(100vh - 80px);
	padding-left: 50px;
	padding-top: 10px;
	gap: 30px;
}

.left, .right {
  flex: 1; /* This will allow both children to share the space equally */
  padding: 20px;
}

.left {
	flex: 1;
	/* Your styles for left container */
}

.right {
	display: flex;
	flex-direction: column; /* Stack children vertically */
	align-items: center;
	justify-content: center; /* Center children vertically */
	background-color: #f0e6d2;
	padding: 20px;
	border-radius: 10px;
	overflow: visible; /* Ensure that content is not hidden */
  margin-right: 20px;
}

.price-container {
	background-color: #1c1e86; /* Blue background color */
	color: white; /* White text color */
	font-size: 45px; /* Larger font size */
	padding: 40px; /* Add padding for spacing */
	border-radius: 20px; /* Add border radius for rounded corners */
	width: 260px; /* Adjust width to fit content */
	height: auto; /* Adjust height to fit content */
}

.pay-button {
	margin-top: 10px; /* Add margin to separate button from the price */
	background-color: #4CAF50; /* Green background color for button */
	color: white; /* White text color */
	border: none; /* Remove button border */
	padding: 10px 20px; /* Add padding for button size */
	border-radius: 5px; /* Add border radius for rounded button */
	cursor: pointer; /* Add pointer cursor on hover */
	width: 100%; /* Button width to fill container */
}
</style>