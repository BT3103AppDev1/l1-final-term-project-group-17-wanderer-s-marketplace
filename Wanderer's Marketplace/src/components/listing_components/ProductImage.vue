<template>
	<div class="product-image">
		<div class="title">Product Image</div>
		<div class="image-container">
			<img :src="currentListing.imageUrl" alt="Product Image" />
		</div>
	</div>
</template>

<script>
    import { mapState } from 'vuex';


export default {
	name: "ProductImage",
	computed: {
        ...mapState(['currentListing']),
        listingId() {
        // Ensure that the ID is correctly retrieved from your Vuex state
        return this.currentListing?.id;
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
	margin-top: 0px;
}

.title {
	font-size: 1.2rem;
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
</style>
