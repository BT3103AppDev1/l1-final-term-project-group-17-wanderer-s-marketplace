<template>
	<div class="page-container">
		<div class="offer-header">
			<h1>Extend an Offer</h1>
			<p>hidden</p>
		</div>
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

.product-offer-container {
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
</style>
