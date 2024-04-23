<template>
    <div class="listing-parent-container">
      <FilterSidebar @filters-applied="handleFiltersApplied" />
      <ProductListing :filters="activeFilters" />
    </div>
  </template>
  
  <script>
  import FilterSidebar from './FilterSidebar.vue';
  import ProductListing from './ProductListing.vue';
  
  export default {
    components: {
      FilterSidebar,
      ProductListing
    },
    data() {
      return {
        activeFilters: {}
      }
    },
    methods: {
      handleFiltersApplied(filters) {
        console.log("Filters applied:", filters);
        this.activeFilters = filters;
      }
    }
  }
  </script>
  
  <style scoped>
  .listing-parent-container {
    display: flex;
    width: 1500px; /* Adjust based on your layout's needs */
    margin: 0 auto; /* Centers the marketplace in the middle of the page */
    padding: 20px; /* Spacing around the marketplace */
    gap: 30px; /* Spacing between filter and listings */
  }
  
  /* You may need additional styles here to match the screenshot. */
  
  </style>