<template>
	<div class="product-details">
		<form id="myform">
			<div class="title">Product Details</div>
			<div class="product-name">
				<div class="header">Product Name</div>
				<div class="input-row">
					<input
						type="text"
						v-model="productName"
						id="productName"
						placeholder="Product Name"
						required=""
					/>
				</div>
			</div>
			<div class="purchase-quantity-colour-size grouped-items three-items">
				<div class="purchase-quantity">
					<div class="header">Purchase Quantity</div>
					<input
						type="number"
						v-model.number="quantity"
						id="quantity"
						placeholder="Quantity"
						required=""
					/>
				</div>
				<div class="colour">
					<div class="header">Colour</div>
					<input type="text" v-model="colour" placeholder="Colour" id="colour"/>
				</div>
				<div class="size">
					<div class="header">Size</div>
					<input type="text" v-model="size" placeholder="Size" id="size"/>
				</div>
			</div>
			<div class="purchase-currency-minProductPrice-maxProductPrice grouped-items three-items">
				<div class="purchase-currency">
					<div class="header">Purchase Currency</div>
					<input type="text" id="currency" value="SGD" disabled />
				</div>
				<div class="minProductPrice">
					<div class="header">Min. Product Price</div>
					<input
						type="number"
						step="0.01"
						v-model.number="minProductPrice"
						id="minProductPrice"
						placeholder="Min. Product Price"
						required=""
					/>
				</div>
				<div class="maxProductPrice">
					<div class="header">Max. Product Price</div>
					<input
						type="number"
						step="0.01"
						v-model.number="maxProductPrice"
						id="maxProductPrice"
						placeholder="Max. Product Price"
						required=""
					/>
				</div>
			</div>
			<div class="delivery-fee-country-purchase grouped-items two-items">
				<div class="delivery-fee">
					<div class="header">Delivery Fee</div>
					<input
						type="number"
						step="0.01"
						v-model="deliveryFee"
						id="deliveryFee"
						placeholder="Delivery Fee"
						required=""
					/>
				</div>
				<div class="country-purchase">
					<div class="header">Country of Purchase</div>
					<input type="text" v-model="country" placeholder="Country" required="" id="country" />
				</div>
			</div>
			<div class="estimated-delivery-date">
				<div class="header">Preferred Date of Delivery</div>
				<input
					type="date"
					v-model="estimatedDeliveryDate"
					id="estimatedDeliveryDate"
					placeholder="Estimated Delivery Date"
					required=""
				/>
			</div>
		</form>
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
	width: 90%;
}

.title {
	font-size: 1.2rem;
	font-weight: bold;
	margin-bottom: 1rem;
	text-align: left;
}

.header {
	font-size: 0.8rem;
	text-align: left;
}

.input-row {
	display: flex;
	gap: 1rem;
}

input {
	flex: 1;
	padding: 0.5rem;
	border-radius: 5px;
	border: 1px solid #ccc;
}

.product-name, 
.purchase-quantity, 
.colour, 
.size, 
.purchase-currency, 
.minProductPrice, 
.maxProductPrice, 
.delivery-fee, 
.country-purchase, 
.estimated-delivery-date {
  display: flex;
  flex-direction: column; /* Stack flex children vertically */
  margin-bottom: 1rem; /* Add some space between each section */
}

.purchase-quantity, .colour, .size,
.purchase-currency, .minProductPrice, .maxProductPrice,
.delivery-fee, .country-purchase {
  flex-grow: 1;
  flex-basis: 0; /* Override any width/min-width properties */
  max-width: 100%; /* They can grow up to 100% of their parent container */
}

.purchase-quantity-colour-size,
.purchase-currency-minProductPrice-maxProductPrice, 
.delivery-fee-country-purchase {
  display: flex;
  justify-content: space-between; /* Space out children evenly */
  gap: 0.5rem; /* Reduce the gap between items */
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .purchase-quantity-colour-size,
  .purchase-currency-minProductPrice-maxProductPrice, 
  .delivery-fee-country-purchase {
    flex-direction: column; /* Stack children vertically on smaller screens */
    gap: 0.5rem;
  }

  .purchase-quantity, .colour, .size,
  .purchase-currency, .minProductPrice, .maxProductPrice,
  .delivery-fee, .country-purchase {
    max-width: none; /* Remove max-width constraint */
    flex-basis: auto; /* Reset flex-basis to default */
  }
}

/* Adjust flex container to wrap items when necessary */
.grouped-items {
  flex-wrap: wrap; /* Allow items to wrap */
}

/* Specify a minimum width for flex items to prevent them from becoming too narrow */
.grouped-items > div {
  min-width: 120px; /* Adjust minimum width as needed */
}
</style>