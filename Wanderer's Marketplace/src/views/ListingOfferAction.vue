<template>
	<div class="page-container">
		<div class="offer-header">
			<h1>View Offers</h1>
			<p>hidden</p>
		</div>
		<div class="product-details-container">
			<div class="left">
				<ProductImage />
			</div>
			<div class="right">
				<component :is="currentRightComponent" />
			</div>
		</div>
	</div>
</template>

<script>
// Import components to be used 
import ProductImage from "../components/listing_components/ProductImage.vue";
import ViewListingOffer from "../components/listing_components/ViewListingOffer.vue";

export default {
	name: "ListingOfferAction",
	components: {
		ProductImage,
		ViewListingOffer,
	},
	data() {
		return {
			currentRightComponent: "ViewListingOffer",
		};
	},
};
</script>

<style scoped>
.product-details-container {
	display: flex;
	justify-content: center;
	align-items: stretch;
	padding: 20px 50px 50px 50px;
	margin: auto;
	width: auto;
	gap: 5%;
}

.left,
.right {
	padding: 10px;
	max-width: 50%;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.action-button {
	padding: 10px 20px;
	border: none;
	border-radius: 30px;
	background-color: green; /* A green color to match the Submit button in the image */
	color: #fff;
	cursor: pointer;
	margin-top: 10px;
}

.offer-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	text-align: center;
	padding: 20px 50px 0px 50px;
}

.offer-header h1 {
	margin: 0;
}

.offer-header p {
	font-size: 20px;
	color: #b3e3eb;
}
</style>
