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
    display: flex; /* Adjust based on your layout's needs */
   /* Centers the marketplace in the middle of the page */
    padding: 0px; /* Spacing around the marketplace */
    gap: 30px; /* Spacing between filter and listings */
    overflow: scroll;
    white-space: normal;
    display: grid;

	grid-template-columns: repeat(
		3,
		minmax(200px, 1fr)
	); /* This will create three columns of equal width */
	grid-gap: 26px; /* This will create space between your cards */
	padding: 26px;
	/* Add responsive behavior if necessary */
	@media (max-width: 1200px) {
		grid-template-columns: repeat(2, 1fr); /* Two columns for smaller screens */
	}
	@media (max-width: 768px) {
		grid-template-columns: 1fr; /* One column for even smaller screens */
	}
  }
  
  /* You may need additional styles here to match the screenshot. */
  
  </style>