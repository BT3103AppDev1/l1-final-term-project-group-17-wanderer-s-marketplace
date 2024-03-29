<template>
  <div class="filter-sidebar">
    <!-- Search input -->
    <div class="filter-item">
      <label class="filter-label">Search</label>
      <input type="text" v-model="search" placeholder="Search" class="search-input" />
      <button class="search-button">
        <!-- Add search icon here -->
      </button>
    </div>

    <!-- Category select -->
    <div class="filter-item">
      <label class="filter-label">Category</label>
      <div class="filter-options">
        <button
          class="filter-option"
          :class="{ 'active': category === 'Electronics' }"
          @click="category = 'Electronics'">Electronics</button>
        <button
          class="filter-option"
          :class="{ 'active': category === 'Beauty' }"
          @click="category = 'Beauty'">Beauty</button>
        <button
          class="filter-option"
          :class="{ 'active': category === 'Consumables' }"
          @click="category = 'Consumables'">Consumables</button>
      </div>
    </div>

    <!-- Sort select -->
    <div class="filter-item">
      <label class="filter-label">Sort By</label>
      <div class="filter-options">
        <button
          class="filter-option"
          :class="{ 'active': sort === 'Popularity' }"
          @click="sort = 'Popularity'">Popularity</button>
        <button
          class="filter-option"
          :class="{ 'active': sort === 'Newest' }"
          @click="sort = 'Newest'">Newest</button>
        <button
          class="filter-option"
          :class="{ 'active': sort === 'Oldest' }"
          @click="sort = 'Oldest'">Oldest</button>
      </div>
    </div>

    <!-- Country select -->
    <div class="filter-item">
      <select v-model="country">
        <option disabled value="">Country of Purchase</option>
        <!-- Populate with actual country options -->
      </select>
    </div>

    <!-- Price range input -->
    <div class="filter-item">
      <label class="filter-label">Maximum Product Price</label>
      <input type="number" v-model.number="maxPrice" placeholder="Max. Price" />
    </div>

    <!-- Delivery fee range input -->
    <div class="filter-item">
      <label class="filter-label">Delivery Fee</label>
      <div class="delivery-fee-inputs">
        <input type="number" v-model.number="minDeliveryFee" placeholder="Min. Fee" class="number-input small-input" />
        <input type="number" v-model.number="maxDeliveryFee" placeholder="Max. Fee" class="number-input small-input" />
      </div>

    </div>

    <!-- Action buttons -->
    <div class="filter-item action-buttons">
      <button class="apply-button" @click="applyFilters">Apply Filters</button>
      <button class="reset-button" @click="resetFilters">Reset to Default</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: '',
      category: '',
      sort: '',
      country: '',
      maxPrice: null,
      minDeliveryFee: null,
      maxDeliveryFee: null
    }
  },
  methods: {
    applyFilters() {
      // Reference to the Firestore collection
      const listingsRef = firebase.firestore().collection('listings');

      // Start constructing the query
      let query = listingsRef;

      // Filter by category if one is selected
      if (this.category) {
        query = query.where('Category', '==', this.category);
      }

      // Add more filters as necessary, based on the search terms and other filter criteria
      if (this.search) {
        query = query.where('ProductName', '>=', this.search).where('ProductName', '<=', this.search + '\uf8ff');
      }

      if (this.country) {
        query = query.where('Country', '==', this.country);
      }

      // For price range, you need to ensure you have both min and max set to apply this filter
      if (this.maxPrice !== null) {
        query = query.where('MaxProductPrice', '<=', this.maxPrice);
      }

      if (this.minDeliveryFee !== null && this.maxDeliveryFee !== null) {
        query = query.where('DeliveryFee', '>=', this.minDeliveryFee)
                     .where('DeliveryFee', '<=', this.maxDeliveryFee);
      }

      // Now, execute the query
      query.get().then(snapshot => {
        if (snapshot.empty) {
          console.log('No matching documents.');
          return;
        }  

        // Clear the current products
        this.products = [];

        snapshot.forEach(doc => {
          // Push each matching listing into the products array
          this.products.push(doc.data());
        });

        this.$emit('filters-applied', {
          search: this.search,
          category: this.category,
          country: this.country,
          maxPrice: this.maxPrice,
          minDeliveryFee: this.minDeliveryFee,
          maxDeliveryFee: this.maxDeliveryFee
      });
      })
      .catch(error => {
        console.log("Error getting documents: ", error);
      });
    },
    resetFilters() {
      // Logic to reset all filters to their default state
      this.search = '';
      this.category = '';
      this.sort = '';
      this.country = '';
      this.maxPrice = null;
      this.minDeliveryFee = null;
      this.maxDeliveryFee = null;
    }
  }
}
</script>

<style scoped>
.filter-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #FFF1E7;
  padding: 1rem;
  border-radius: 20px;
}

.filter-item {
  margin-bottom: 0.5rem;
  padding-right: 2rem; /* Adjust this as needed */
  padding-left: 1rem; /* Adjust this as needed */
}

.filter-label {
  font-size: 1.0rem;
  color: #333;
  margin-bottom: 0.5rem;
  font-weight: 550;
  display: block;
  text-align: left; /* this aligns the text to the left */
  padding-left: 0; /* this ensures there's no padding on the left */
  margin-left: 0; /* this ensures there's no margin on the left */
  width: 100%; 
}

.filter-options {
  display: flex;
  gap: 0.5rem;
}

.filter-option {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 15px;
  background-color: #e7e7e7;
  cursor: pointer;
  transition: background-color 0.3s;
}

.filter-option.active {
  background-color: #007bff;
  color: white;
}


.search-input,
select,
input[type="number"] {
  width: 100%;
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.search-button {
  background: none;
  border: none;
  cursor: pointer;
}

.delivery-fee-inputs {
  display: flex;
  gap: 0.5rem;
}

.number-input {
  flex: 1;
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.action-buttons button {
  width: 100%;
  padding: 0.5rem;
  border-radius: 5px;
  margin-top: 0.5rem;
}

.apply-button, .reset-button {
  background-color: #051E55;
  color: white;
  border: none;
  margin-top: 0.5rem;
  padding: 0.5rem;
  border-radius: 5px;
  cursor: pointer;
}

.reset-button {
  background-color: #6c757d;
}

.filter-sidebar .filter-item:last-child {
  margin-bottom: 0;
  padding-left: 0;
  margin-left: 0;
}

.filter-option.active {
  background-color: #051E55; /* Updated color for the selected filters */
  color: white;
}

/* ... additional styles as needed */
</style>
