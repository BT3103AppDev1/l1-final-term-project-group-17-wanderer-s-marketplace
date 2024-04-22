<template>
	<div class="product-listing">
		<ProductCard
			v-for="product in products"
			:key="product.id"
			:product="product"
			@cardClick="handleCardClick"
		/>
	</div>
</template>

<script>
import ProductCard from "./ProductCard.vue";
import firebaseApp from "@/firebase.js";
import { getFirestore } from "firebase/firestore";
import app from "@/firebase.js";
const db = getFirestore(firebaseApp);
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { mapActions } from "vuex";

export default {
	props: {
		filters: {
			type: Object,
			default: () => ({}),
		},
	},
	components: {
		ProductCard,
	},
	data() {
		return {
			allProducts: [], // Store all products fetched initially
			products: [], // Products to display after applying filters
		};
	},
	created() {
		this.fetchAllProducts();
	},
	watch: {
		filters: {
			handler(newFilters) {
				this.applyFilters(newFilters);
			},
			deep: true,
		},
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
		async fetchAllProducts(filters) {
			try {
				// const { search, category, country, maxPrice, minDeliveryFee, maxDeliveryFee, sort } = filters;
				console.log("filters");
				console.log(filters);
				let q = query(
					collection(db, "Listings"),
					where("ListingStatus", "==", "Available")
				);
				console.log(this.$store.state.user);
				if (this.$store.state.user) {
					console.log(this.$store.state.user.uid);
					const user_uid = this.$store.state.user.uid;
					q = query(q, where("UserID", "!=", user_uid));
				}

				const querySnapshot = await getDocs(q);
				this.allProducts = querySnapshot.docs.map((doc) => {
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
						timeCreation: data.TimeCreation,
						userID: data.UserID,
						acceptedOfferUserID: data.AcceptedOfferUserID,
						// Add other product details you want to display...
					};
				});
				this.products = [...this.allProducts];
				console.log(this.products);
				console.log("showing products");
			} catch (error) {
				console.error("Error getting documents: ", error);
			}
		},
		applyFilters(filters) {
			this.products = this.allProducts;
			const temp = [...this.allProducts];
			this.products = this.allProducts.filter((product) => {
				return (
					(filters.search === "" ||
						product.name
							.toLowerCase()
							.includes(filters.search.toLowerCase())) &&
					//  (filters.category === null|| product.Category === filters.category) &&
					(filters.country === "" ||
						product.country
							.toLowerCase()
							.includes(filters.country.toLowerCase())) &&
					(filters.maxPrice === "" ||
						parseFloat(product.maxPrice) <= parseFloat(filters.maxPrice)) &&
					(filters.minDeliveryFee === "" ||
						parseFloat(product.deliveryFee) >=
							parseFloat(filters.minDeliveryFee)) &&
					(filters.maxDeliveryFee === "" ||
						parseFloat(product.deliveryFee) <=
							parseFloat(filters.maxDeliveryFee))
				);
			});
			this.allProducts = temp;

			if (filters.sort === "Newest") {
				this.products.sort(
					(a, b) =>
						new Date(b.deliveryDate).getTime() -
						new Date(a.deliveryDate).getTime()
				);
			} else if (filters.sort === "Oldest") {
				this.products.sort(
					(a, b) =>
						new Date(a.deliveryDate).getTime() -
						new Date(b.deliveryDate).getTime()
				);
			}
		},
	},
};
</script>

<style scoped>
.product-listing {
	display: grid;
	grid-template-columns: repeat(
		3,
		minmax(200px, 1fr)
	); /* This will create three columns of equal width */
	grid-gap: 26px; /* This will create space between your cards */
	padding: 26px;
	/* Add responsive behavior if necessary */
	@media (max-width: 1200px) {
		grid-template-columns: repeat(2, 1fr); /* Two columns for smaller screens */
	}
	@media (max-width: 768px) {
		grid-template-columns: 1fr; /* One column for even smaller screens */
	}
}
</style>
