<template>
    <div class="product-card" @click = "cardClicked">
      <img :src="product.imageUrl" alt="Product image" class="product-image">
      <div class="product-info">
        <h3 class="product-name">{{ product.name }}</h3>
        <p :class="statusClass">{{ product.status }}</p>
      </div>
    </div>
</template>

<script>
    export default {
    props: {
        product: Object,
    },
    computed: {
        statusClass() {
          return {
            'product-status': true, // Always apply this class
            'status-available': this.product.status === 'Available', // Apply this class if status is 'available'
            'status-accepted': this.product.status === 'Accepted', // Apply this class if status is 'accepted'
            'status-purchased': this.product.status === 'Purchased', // Apply this class if status is 'purchased'
            'status-completed': this.product.status === 'Completed', // Apply this class if status is 'completed'
          };
        },
    },
    methods: {
      cardClicked() {
        this.$emit('cardClick', this.product); // Emit a custom event with the product data
			//this.$router.push({ name: 'AvailableListingShopper' });
      },
      formatDate(date) {
        if (!date) return '';
        // Assuming date is a Firestore Timestamp and converting to JavaScript Date
        const jsDate = new Date(date.seconds * 1000);
        return jsDate.toLocaleDateString("en-US"); // Format the date as you need
      }
    }
  };
</script>

<style scoped>
    .product-card {
        display: flex;
        flex-direction: column;
        min-height: 150px;
        border: 1px solid #e1e1e1;
        border-radius: 8px;
        overflow: hidden;
        background: #fff;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        width: 200px;
        overflow: visible;
    white-space: normal;
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
        padding: 8px; /* Reduced padding */
        text-align: center;
        background-color: #fff1e7;
        height: 82px; /* You may need to adjust this depending on the content */
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

    .product-status {
        font-size: 0.8rem;
        margin: 4px 0;
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