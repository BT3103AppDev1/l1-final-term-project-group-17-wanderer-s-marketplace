<template>
	<div class="product-listing">
		<HomeCard
			v-for="product in sortedProducts"
			:key="product.id"
			:product="product"
			@cardClick="handleCardClick"
		/>
	</div>
</template>

<script>
import HomeCard from "./HomeCard.vue";
import firebaseApp from "@/firebase.js";
import { getFirestore } from "firebase/firestore";
import app from "@/firebase.js";
const db = getFirestore(firebaseApp);
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { mapActions } from "vuex";

export default {
	props: {
		filters: {
			type: Object,
			default: () => ({}),
		},
		userID: {
			type: String,
			required: true,
		},
	},
	components: {
		HomeCard,
	},
	data() {
		return {
			products: [],
			userUID: null,
		};
	},
	computed: {
		sortedProducts() {
			// Split the products into two arrays, one for active and one for completed listings
			const activeProducts = this.products.filter(
				(p) => p.status !== "Completed"
			);
			const completedProducts = this.products.filter(
				(p) => p.status === "Completed"
			);

			// Sort the active products by Estimated Delivery Date from earliest to latest
			activeProducts.sort(
				(a, b) => new Date(a.deliveryDate) - new Date(b.deliveryDate)
			);

			// Concatenate the active listings with the completed listings at the end
			return [...activeProducts, ...completedProducts];
		},
	},
	created() {
		const auth = getAuth();
		onAuthStateChanged(auth, (user) => {
			console.log("Authentication state changed: ", user.email);
			if (user) {
				this.userUID = user.uid;
				console.log("User is logged in");
				this.fetchProducts(); // Fetch products once user is logged in
			} else {
				console.log("User is not logged in.");
			}
		});
	},
	methods: {
		...mapActions(["setCurrentListing"]),
		handleCardClick(product) {
			this.setCurrentListing(product);
			// Optionally redirect to the product's detail view
			this.$router.push({
				name: "ListingDetail",
				params: { productId: product.id },
			});
			console.log("product", product);
		},
		async fetchProducts() {
			try {
				let q = query(
					collection(db, "Listings"),
					where("UserID", "==", this.userID) // Add this condition to filter by UserID
				);

				const querySnapshot = await getDocs(q);
				this.products = querySnapshot.docs.map((doc) => {
					const data = doc.data();
					return {
						id: doc.id,
						name: data.ProductName, // Make sure 'ProductName' matches the field in Firestore
						maxPrice: data.MaxProductPrice, // Same here for 'MaxProductPrice'
						date: data.DateCreation, // And for 'DateCreation'
						country: data.Country, // And for 'Country'
						imageUrl: data.ProductImage, // Ensure there is an image URL in the data

						color: data.Colour,
						currency: data.Currency,
						deliveryFee: data.DeliveryFee,
						deliveryDate: data.EstimatedDeliveryDate,
						minPrice: data.MinProductPrice,
						listingStatus: data.ListingStatus,
						quantity: data.Quantity,
						size: data.Size,
						timeCreation: data.timeCreation,
						userID: data.UserID,
						status: data.ListingStatus,
						acceptedOfferUserID: data.AcceptedOfferUserID,
					};
				});
				console.log(this.products);
				console.log("showing products");
			} catch (error) {
				console.error("Error getting documents: ", error);
			}
		},
		watch: {
			userID(newVal, oldVal) {
				if (newVal !== oldVal) {
					this.fetchProducts();
				}
			},
		},
	},
};
</script>

<style scoped>
.product-listing {
	display: flex; /* Change from grid to flex */
	/* grid-template-columns: repeat(3,minmax(200px, 1fr)); */ /* Remove grid-template-columns */
	grid-gap: 26px; /* This will create space between your cards */
	padding: 26px;
	/* Add responsive behavior if necessary */
	@media (max-width: 1200px) {
		/* grid-template-columns: repeat(2, 1fr); */ /* Remove this line */
	}
	@media (max-width: 768px) {
		/* grid-template-columns: 1fr; */ /* Remove this line */
	}
}

/* Ensure each card behaves as an inline element */
.card {
	display: inline-block; /* or display: inline; */
	/* Add other card styles as needed */
}
</style>
