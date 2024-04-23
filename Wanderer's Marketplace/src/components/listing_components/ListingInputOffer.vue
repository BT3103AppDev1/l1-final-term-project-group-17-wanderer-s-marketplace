<template>
	<div class="input-offer-outer-container">
		<div class="input-offer-inner-container">
			<h2 class="offer-heading">Input your offer</h2>
			<p class="offer-description">
				This offer includes the product price and delivery fee.
			</p>
			<div class="offer-input-wrapper">
				<input
					type="number"
					v-model.number="offer_amt"
					class="offer-input"
					:placeholder="`$${defaultOfferAmount}`"
					min="0"
					ref="offerInput"
					@focus="handleInput"
				/>
				<button
					@click="submitOffer"
					class="submit-offer-button"
					:disabled="!offer_amt && offer_amt !== 0"
				>
					Submit
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from "vuex";
import firebaseApp from "../../firebase.js";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
const db = getFirestore(firebaseApp);

export default {
	name: "InputListingOffer",
	data() {
		return {
			offer_amt: "",
		};
	},
	computed: {
		...mapState(["currentListing"]),
		defaultOfferAmount() {
			return this.$store.state.currentListing.deliveryFee || 0;
		},
	},
	watch: {
		offer_amt(newVal, oldVal) {
			if (!newVal && newVal !== 0) {
				// If the new value is falsy (but not 0), set it to the defaultOfferAmount
				this.$nextTick(() => {
					this.offer_amt = this.defaultOfferAmount;
				});
			}
		},
	},
	methods: {
		async submitOffer() {
			const user_uid = this.$store.state.user.uid;
			const listing_uid = this.$store.state.currentListing.id;

			const offerObject = {
				OfferID: this.generateOfferID(user_uid, listing_uid), // Assuming you have a method to generate a unique OfferID
				ListingID: listing_uid,
				OfferByUserID: user_uid,
				OfferPrice: this.offer_amt,
				PurchaseProofImage: "",
				OfferStatus: "Available", // Default status when an offer is first created
			};
			console.log("offerObj", offerObject);

			try {
				// Use Firestore addDoc to add the offerObject to the "offers" collection
				await setDoc(doc(db, "Offers", offerObject.OfferID), offerObject);
				console.log("Offer submitted:", offerObject);

				// Emit an event in case the parent component needs to react to the offer submission
				this.$emit("offerSubmitted", offerObject);

				// Redirect back to the marketplace page using Vue Router
				this.$router.push({ name: "Marketplace" }); // Ensure you have a route named 'Marketplace'
			} catch (error) {
				console.error("Error submitting offer:", error);
				// Handle any errors here, such as displaying a message to the user
			}
		},
		generateOfferID(user_uid, listing_uid) {
			let currentDate = new Date();
			let dateCreation = currentDate.toISOString().split("T")[0];
			let timeCreation = currentDate.toTimeString().split(" ")[0];
			return (
				user_uid + "-" + listing_uid + "-" + dateCreation + "-" + timeCreation
			);
		},

		handleInput(event) {
			if (!event.target.value) {
				// If input is empty after change, set to null
				this.offer_amt = null;
			}
		},
	},
};
</script>

<style scoped>
.input-offer-outer-container {
	background: #fff1e7; /* Beige background */
	padding: 1em;
	border-radius: 16px;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%; /* Make the outer container fill the height */
	width: 100%;
	margin-left: auto;
}

.input-offer-inner-container {
	background: white; /* White inner box */
	border-radius: 16px;
	padding: 2em;
	max-width: 400px; /* Limit the width to match your design */
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Optional: add some shadow */
	width: 100%; /* Make the inner container take full width */
}

.offer-heading,
.offer-description {
	text-align: center;
}

.offer-input-wrapper {
	margin-top: 1em;
}

.offer-input {
	font-size: 2em;
	padding: 0.5em;
	margin-bottom: 1em;
	border: 2px solid #ccc;
	border-radius: 4px;
	text-align: center;
}

.submit-offer-button {
	width: 100%;
	padding: 0.5em;
	border: none;
	border-radius: 4px;
	background-color: #4caf50;
	color: white;
	cursor: pointer;
	font-size: 1em;
}
</style>
