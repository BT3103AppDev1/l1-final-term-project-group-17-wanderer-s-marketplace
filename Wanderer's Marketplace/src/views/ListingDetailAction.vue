<template>
	<div class="page-container">
		<h1 class="offer-header">Extend an Offer</h1>
		<div class="product-offer-container">
			<div class="left">
				<ProductImage />
			</div>
			<div class="right">
				<ListingInputOffer />
			</div>
		</div>
	</div>
</template>

<script>
import ProductImage from "../components/listing_components/ProductImage.vue";
import ListingInputOffer from "../components/listing_components/ListingInputOffer.vue";
// Import other components as needed

export default {
	name: "ListingDetailAction",
	components: {
		ProductImage,
		ListingInputOffer,
		// Include other components you may need
	},
	data() {
		return {
			currentRightComponent: "ListingInputOffer", // This can be changed based on the state
		};
	},
	// You can include methods, computed properties, or watchers to change the currentRightComponent based on the state
};
</script>

<style scoped>
.page-container {
	margin-top: 0%;
	display: flex;
	flex-direction: column;
	align-items: center;
	height: calc(100vh - 80px);
	padding: 50px;
}

.offer-header {
	margin-top: 0%;
	width: 100%;
	text-align: left;
	margin-bottom: 25px; /* Adjust according to your layout */
}

.product-offer-container {
	display: flex;
	width: 100%; /* Adjust the width as needed */
	gap: 25px;
}

.left,
.right {
	flex: 1;
}

.action-button {
	padding: 10px 20px;
	border: none;
	border-radius: 30px;
	background-color: #4caf50; /* A green color to match the Submit button in the image */
	color: #fff;
	cursor: pointer;
	margin-top: 10px;
}
</style>
