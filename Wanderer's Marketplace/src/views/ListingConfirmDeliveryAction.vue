<template>
	<div class="product-details-container">
		<div class="left">
			<!--
			<ProductImage :imageSrc="productDetails.imageUrl" />
			-->
			<ListingImageDetails :imageSrc="productDetails.imageUrl" />
		</div>
		<div class="right">
			<DeliveryConfirmation :listingID="productDetails.ListingID" />
		</div>
	</div>
</template>

<script>
import ProductImage from "../components/listing_components/ProductImage.vue";
import ProductDetailsViewing from "@/components/listing_components/ProductDetailsViewing.vue";
import ListingImageDetails from "../components/listing_components/ListingImageDetails.vue";
import DeliveryConfirmation from "../components/listing_components/DeliveryConfirmation.vue";
import firebaseApp from "@/firebase.js";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import app from "@/firebase.js";
const db = getFirestore(firebaseApp);
import { collection, query, where, getDocs } from "firebase/firestore";
import { mapState } from "vuex";

export default {
	name: "ListingDetail",
	components: {
		ProductImage,
		ProductDetailsViewing,
		DeliveryConfirmation,
		ListingImageDetails,
	},
	data() {
		return {
			// ...other data properties
			hasPendingOffer: false, // This will track whether a pending offer exists
		};
	},
	computed: {
		...mapState(["currentListing", "user"]),
		productDetails() {
			// Use the currentListing from Vuex as the product details
			// or return a default object structure if currentListing is null/undefined
			//console.log("currlisting", this.currentListing)
			return (
				this.currentListing || {
					name: "Loading...",
					quantity: 0,
					color: "",
					size: "",
					currency: "",
					minPrice: 0,
					maxPrice: 0,
					deliveryDate: "",
					country: "",
					listingStatus: "Available",
				}
			);
		},
	},
	methods: {
		async handleDeliveryConfirmation(listingID) {
			try {
				const listingRef = doc(db, "Listings", listingID);
				console.log("listingID");
				await updateDoc(listingRef, {
					ListingStatus: "Completed",
				});
				console.log("listing status updated to completed");
				// Update local state if needed
				// this.productDetails.listingStatus = 'Completed';
			} catch (error) {
				console.error("Error updating document: ", error);
			}
		},
	},
};
</script>

<style scoped>
.product-details-container {
	display: flex;
	justify-content: center;
	align-items: stretch;
	height: calc(100vh - 80px);
	padding: 50px;
	margin: auto;
	gap: 5%;
	width: 80%;
}

h1 {
	margin-top: 20px;
	text-align: left;
	margin-left: 40px;
}

.buttons-container {
	display: flex;
	justify-content: space-evenly; /* This will space out your buttons evenly */
	width: 100%; /* Ensure the container takes full width */
}
</style>
