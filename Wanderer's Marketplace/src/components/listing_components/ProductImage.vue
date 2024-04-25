<template>
	<div class="product-image">
		<div class="title">Product Image</div>
		<div class="image-container">
			<img :src="currentListing.imageUrl" alt="Product Image" />
		</div>
		<p :class="statusClass">{{ this.currentListing.listingStatus }}</p>
	</div>
</template>

<script>
import { mapState } from "vuex";

export default {
	name: "ProductImage",
	computed: {
		...mapState(["currentListing"]),
		listingId() {
			// Ensure that the ID is correctly retrieved from your Vuex state
			return this.currentListing?.id;
		},
		statusClass() {
			return {
				"product-status": true, // Always apply this class
				"status-available": this.currentListing.listingStatus === "Available", // Apply this class if status is 'available'
				"status-accepted": this.currentListing.listingStatus === "Accepted", // Apply this class if status is 'accepted'
				"status-purchased": this.currentListing.listingStatus === "Purchased", // Apply this class if status is 'purchased'
				"status-completed": this.currentListing.listingStatus === "Completed", // Apply this class if status is 'completed'
			};
		},
	},
	props: {
		imageSrc: {
			type: String,
			required: true,
		},
	},
};
</script>

<style scoped>
.product-image {
	background-color: #ffffff;
	border-radius: 20px;
	padding: 1rem;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
	height: 55vh;
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.title {
	font-size: 1.5rem;
	font-weight: bold;
	margin-bottom: 1rem;
}

.image-container {
	width: auto;
	height: auto;
	border-radius: 10px;
	overflow: hidden;
}

.image-container img {
	width: auto;
	height: 322px;
	border-radius: 10px;
}

.product-status {
	font-size: 1rem;
	font-weight: bold;
	/* Remove color property from here */
}

/* Define color classes based on status */
.status-available {
	color: darkblue;
}

.status-accepted {
	color: #fc6a03;
}

.status-purchased {
	color: red;
}

.status-completed {
	color: green;
}
</style>
