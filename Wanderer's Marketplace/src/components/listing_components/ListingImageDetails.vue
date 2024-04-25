<template>
  <div class = "listing-image-details">
    <div class = "listing-name">{{ currentListing.name }}</div>
    <div v-if="currentListing.listingStatus === 'Available'" class="offer-quantity">Qty: {{ currentListing.quantity }}</div>
    <div v-else class="offer-price">Offer Price: ${{ offerPrice }}</div>
    <div class="image-container">
			<img :src="currentListing.imageUrl" alt="Product Image" />
		</div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

export default {
  name: "ListingImageDetails",
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
  data() {
    return {
      offerPrice: null, // Placeholder for the offer price
    };
  },
  created() {
    this.getOfferPrice();
  },
  methods: {
    async getOfferPrice() {
      const db = getFirestore();
      const q = query(
        collection(db, 'Offers'),
        where('ListingID', '==', this.listingId),
        where("OfferStatus", "==", "Accepted")
      );

      try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const offer = querySnapshot.docs[0].data();
          this.offerPrice = offer.OfferPrice;
        } else {
          console.error('No offer found for the current listing');
        }
      } catch (error) {
        console.error('Error getting offer price:', error);
      }
    },
  },
};
</script>

<style scoped>
.listing-image-details {
	background-color: #fff1e7;
	border-radius: 20px;
	padding: 1rem;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
}

.listing-name {
	font-size: 1.2rem;
	font-weight: bold;
	margin-bottom: 10px;
  text-align: left;
  margin-left: 10%;
  color: black;
  margin-top: 2%;
}
.offer-price {
	font-size: 1.5rem;
	font-weight: bolder;
	margin-bottom: 1rem;
  text-align: left;
  margin-left: 10%;
  color: black;
}

.offer-quantity {
	font-size: 1.5rem;
	font-weight: bolder;
	margin-bottom: 1rem;
  text-align: left;
  margin-left: 10%;
  color: black;
}

.image-container {
	width: 100%;
	height: auto;
	border-radius: 10px;
	overflow: hidden;
}

.image-container img {
	width: 60%;
	height: auto;
	border-radius: 10px;
}
</style>