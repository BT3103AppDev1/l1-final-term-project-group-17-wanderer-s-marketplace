<template>
	<div class="product-details">
		<div class="title">Product Details</div>
		<div class="input-row">
			<input
				type="text"
				v-model="productName"
				placeholder="Product Name"
				required=""
			/>
		</div>
		<div class="input-row">
			<input
				type="number"
				v-model.number="quantity"
				placeholder="Quantity"
				required=""
			/>
			<input type="text" v-model="colour" placeholder="Colour" />
			<input type="text" v-model="size" placeholder="Size" />
		</div>
		<div class="input-row">
			<input type="text" v-model="currency" placeholder="Currency" />
			<input
				type="number"
				step="0.01"
				v-model.number="minProductPrice"
				placeholder="Min. Product Price"
				required=""
			/>
			<input
				type="number"
				step="0.01"
				v-model.number="maxProductPrice"
				placeholder="Max. Product Price"
				required=""
			/>
		</div>
		<div class="input-row">
			<input
				type="number"
				step="0.01"
				v-model="deliveryFee"
				placeholder="Delivery Fee"
				required=""
			/>
			<input type="text" v-model="country" placeholder="Country" required="" />
		</div>
		<div class="input-row">
			<input
				type="date"
				v-model="estimatedDeliveryDate"
				placeholder="Estimated Delivery Date"
				required=""
			/>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			productName: "",
			quantity: null,
			colour: "",
			size: "",
			currency: "",
			minPrice: null,
			maxPrice: null,
			deliveryDate: "",
			country: "",
		};
	},
};
</script>

<style scoped>
.product-details {
	background-color: #fff1e7;
	border-radius: 20px;
	padding: 1rem;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
}

.title {
	font-size: 1.2rem;
	font-weight: bold;
	margin-bottom: 1rem;
	text-align: left;
}

.input-row {
	display: flex;
	gap: 1rem;
	margin-bottom: 1rem;
}

.input-row input {
	flex: 1;
	padding: 0.5rem;
	border-radius: 5px;
	border: 1px solid #ccc;
}
</style>
