<template>
	<div class="page-container">
		<h1>View Offers</h1>
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
import ProductImage from "../components/listing_components/ProductImage.vue";
import ViewListingOffer from "../components/listing_components/ViewListingOffer.vue";
// Import other components as needed

export default {
	name: "ListingOfferAction",
	components: {
		ProductImage,
		ViewListingOffer,
	},
	data() {
		return {
			currentRightComponent: 'ViewListingOffer', 
		};
	},
	
};
</script>

<style scoped>

.product-details-container {
	margin-top: 0%;
	display: flex;
	justify-content: center;
	align-items: stretch;
	padding: 30px;
}


.left {
	flex: 1;
}

.right {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
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

.page-container h1 {
margin-left: 4%;
margin-top: 2%;
margin-bottom: 0%;
}

.page-container  {
margin-top: 3.5%;
}
</style>
