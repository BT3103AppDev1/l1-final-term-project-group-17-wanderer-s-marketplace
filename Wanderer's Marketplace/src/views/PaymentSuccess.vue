<template>
	<div class="payment-success-container">
		<h1>Payment Successful!</h1>
		<p>
			Your payment has been processed successfully. Your offer has been
			accepted.
		</p>
		<button
			@click="redirectToHome"
			class="home-button"
			:disabled="!isUpdateComplete"
		>
			Go to Home Page
		</button>
	</div>
</template>

<script>
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";

export default {
	name: "PaymentSuccess",
	props: ["offerId"],
	data() {
		return {
			isUpdateComplete: false,
		};
	},
	created() {
		const offerId = this.$route.query.offerId;
		this.updateListingStatus(offerId);
	},
	methods: {
		async updateListingStatus(offerId) {
			const db = getFirestore();
			const offerDocRef = doc(db, "Offers", offerId);

			try {
				const offerDoc = await getDoc(offerDocRef);
				if (!offerDoc.exists()) {
					console.error("No such offer found!");
					return;
				}
				await updateDoc(offerDocRef, {
					OfferStatus: "Accepted",
				});
				console.log(`Offer ${offerId} updated to Accepted.`);

				const listingId = offerDoc.data().ListingID;
				const listingDocRef = doc(db, "Listings", listingId);

				await updateDoc(listingDocRef, {
					ListingStatus: "Accepted",
				});
				console.log(
					`Offer ${offerId} accepted and listing ${listingId} updated to Accepted.`
				);
				this.isUpdateComplete = true; // Enable the button only after the update is complete
			} catch (error) {
				console.error("Error processing your transaction:", error);
				alert("There was an issue with processing the payment.");
			}
		},
		redirectToHome() {
			this.$router.push("/home");
		},
	},
};
</script>

<style>
.payment-success-container {
	display: flex;
	flex-direction: column;
	justify-content: center; /* Centers the content vertically */
	align-items: center; /* Centers the content horizontally */
	max-width: 600px;
	height: 200px; /* Adjust the height as needed */
	margin: 50px auto;
	padding: 20px;
	text-align: center;
	border: 1px solid #ccc;
	border-radius: 10px;
	background-color: #f9f9f9;
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}

.payment-success-container h1 {
	color: #333;
	margin: 0; /* Remove default margins */
}

.payment-success-container p {
	font-size: 16px;
	color: #333;
	margin-top: 10px; /* Adds a little space above the paragraph */
}

.home-button {
	padding: 10px 20px;
	font-size: 16px;
	color: white;
	background-color: #051e55;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	margin-top: 20px; /* Adds space above the button */
}

.home-button:hover {
	background-color: #063a7d; /* A darker shade of blue for hover effect */
}

.home-button:disabled {
	background-color: #ccc;
	color: #666;
	cursor: not-allowed;
}
</style>
