<template>
  <div class="product-card" @click="cardClicked">
    <img :src="product.imageUrl" alt="Product image" class="product-image">
    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-price">$ {{ product.deliveryFee }}</p>
      <!-- Added location and date information -->
      <p class="product-location-date">{{ product.date }} | {{ product.country }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    product: Object,
  },
  methods: {
    cardClicked() {
      this.$emit('cardClick', this.product);
    },
    formatDate(date) {
      if (!date) return '';
      // Assuming date is a Firestore Timestamp and converting to JavaScript Date
      const jsDate = new Date(date.seconds * 1000);
      return jsDate.toLocaleDateString("en-US"); // Format the date as you need
    }
  },
};
</script>

<style scoped>
.product-card {
        display: flex;
        flex-direction: column;
        height: max-content;
        border: 1px solid #e1e1e1;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        width: 250px;
        
    }

    .product-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .product-image {
        width: 100%;
        object-fit: cover;
        height: 200px;
    }

    .product-info {
        display: flex;
        flex-direction: column;
        justify-content: center; /* This will vertically center the items */
        align-items: center; /* This will horizontally center the items */
        padding: 8px 8px 12px 8px; /* Reduced padding */
        text-align: center;
        background-color: #fff1e7;
         /* You may need to adjust this depending on the content */
    }

    .product-name {
        font-size: 1rem;
        color: #333;
        margin: 0;
        padding: 0 8px;
        white-space: normal; /* This allows the text to wrap */
        overflow: visible; /* This makes sure that text is not hidden */
        word-wrap: break-word; /* This will break long words to prevent overflow */
    }

.product-price {
  font-size: 0.8rem;
  color: #888;
}

/* New styles for location and date */
.product-location-date {
  font-size: 0.8rem;
  color: #888;
  margin-top: 0px;
}
</style>
