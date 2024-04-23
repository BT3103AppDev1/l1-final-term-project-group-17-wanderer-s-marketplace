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

    <!-- Sort select -->
    <div class="filter-item">
      <label class="filter-label">Sort By</label>
      <div class="filter-options">
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
      <!-- <select v-model="country">
        <option disabled value="">Country of Purchase</option>
 
      </select> -->
      <label class="filter-label">Country of Purchase</label>
      <input type="text" v-model="country" placeholder="Country of Purchase" class="search-input" />
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
      search: "",
      category: null,
      sort: "",
      country: "",
      maxPrice: "",
      minDeliveryFee: "",
      maxDeliveryFee: ""
    }
  },
  emits: ['filters-applied'],
  methods: {
    applyFilters() {
      this.$emit('filters-applied', {
        search: this.search,
        category: this.category,
        sort: this.sort,
        country: this.country,
        maxPrice: this.maxPrice,
        minDeliveryFee: this.minDeliveryFee,
        maxDeliveryFee: this.maxDeliveryFee
      });
      console.log("clicking")
    },
    resetFilters() {
      this.search = '';
      this.category = null;
      this.sort = '';
      this.country = '';
      this.maxPrice = "";
      this.minDeliveryFee = "";
      this.maxDeliveryFee = "";
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
  margin-top: 26px;
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
  width: 108%;
  gap: 0.5rem;
}

.number-input {
  flex: 1;
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
}
.action-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* This will center the buttons */
  gap: 0.5rem; /* Maintain the gap between buttons */
  
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
  margin-left: 2rem;
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
