<template>
    <div class="confirmation-card">
      <div class="confirmation-header"><b>Confirmation of <br>Delivery</b></div>
      <div class="confirmation-body">
        <div class="proof-purchase">
            <div class="proof-text"><b>Proof of Purchase</b></div>
          <div class="document-container">
            <!-- Icon or image goes here 
            <img src = "/icons/favicon_io/document icon.png" alt = "Document Icon" class = "document-icon"> -->
            <img v-if="offer && offer.PurchaseProofImage" :src="offer.PurchaseProofImage" alt="Purchase Proof Image" class="purchase-proof-image">
          </div>
        </div>
        <div class="confirmation-text">
          I confirm that I have received <br> authentic products as requested.
        </div>
        <button class="confirm-btn" @click="confirmDelivery">Confirm</button>
      </div>
    </div>
  </template>
<script>
  import { mapState } from 'vuex';
  import firebaseApp from '../../firebase.js';
  import { getFirestore, doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
  import { onAuthStateChanged, getAuth } from "firebase/auth";
  const db = getFirestore(firebaseApp);

  export default {
    name: 'DeliveryConfirmation',
    computed: {
      ...mapState(['currentListing']),
      listingId() {
      // Ensure that the ID is correctly retrieved from your Vuex state
      return this.currentListing?.id;
      },
    },
    data () {
      return {
        listing: {},
        offer: null
      };
    },
    created() {
      this.fetchData();
      this.getOffer();
    },
    //props: {
    //    listingID: String
    //},
    methods: {
      async getOffer() {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const db = getFirestore(firebaseApp);
          const offersRef = collection(db, "Offers"); //check
          console.log("listing_id", this.$store.state.currentListing.id)
          const q = query(
            offersRef,
            where("ListingID", "==", this.$store.state.currentListing.id), //check
            where("OfferStatus", "==", "Accepted")
          );

          try {
            const querySnapshot = await getDocs(q);
            const offers = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            // Assuming that there will be only one offer matching the criteria
            this.offer = offers.length > 0 ? offers[0] : null;
            if (this.offer) {
              console.log("Offer found: ", this.offer);
            } else {
              console.error("No matching offer found");
            }
          } catch (error) {
            console.error("Error getting offers: ", error);
          }
        } else {
          console.error("User is not authenticated");
        }
      },
      async confirmDelivery() {
        // Emit an event or call a method to handle the confirmation logic
        console.log(this.offer)
        const offerPrice = this.offer.OfferPrice;
        const offerUserId = this.offer.OfferByUserID;
        console.log("offerby user id", offerUserId)
        const userDocRef = doc(db, "Users", offerUserId);
        const userDocSnap = await getDoc(userDocRef);
        if (!userDocSnap.exists()) {
          console.error("No user document found!");
          return;
        }
        
        // Retrieve the seller's Stripe account ID
        const sellerStripeAccountId = userDocSnap.data().stripeUserID;
        if (!sellerStripeAccountId) {
          console.error("Seller's Stripe account ID not found!");
          return;
        }
        try {
          const response = await fetch('https://bt3103clone.vercel.app/payout-seller', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              offerPrice,
              sellerStripeAccountId,
            }),
          });

          if (response.ok) {
            console.log('Transfer to seller successful');
            // Handle the rest of your confirmation logic
          } else {
            throw new Error('Network response was not ok.');
          }
        } catch (error) {
          console.error('Error in confirming delivery:', error);
          return
        }

        const listingDocRef = doc(getFirestore(firebaseApp), "Listings", this.listingId);
        try {
          await updateDoc(listingDocRef, {
            ListingStatus : "Completed"
          });
          alert('Confirmed Offer', this.listingId);
          this.$emit('confirmedDelivery', this.listing);
          this.$router.push('/home');
        } catch (error) {
          console.error("Error updating listing status:", error);
        }
      },
      async fetchData() {
        if (this.listingId) {
          await this.fetchListing();
        } else {
          console.error("No listing ID provided");
        }
      },
      async fetchListing() {
        try {
          const docRef = doc(getFirestore(firebaseApp), "Listings", this.listingId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data()) {
              this.listing = {
              ...docSnap.data(),
              id: docRef.id // Add the document ID to the listing object
              };
          } else {
              console.error("No such listing!");
          }
          } catch (error) {
          console.error("Error fetching listing:", error);
          }
      }
  },
  };
</script>
  
  <style scoped>
  .confirmation-card {
    background-color: #ffffff;
    border-radius: 20px;
    padding: 1rem;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
    min-height: 150px;
    flex-direction: column;
  }
  .proof-purchase{
    background-color: #fff1e7;
    padding: 1rem;
    border-radius: 10px;
    height: auto;
    color: black;
  }
  .purchase-proof-image{
    margin-top: 10px;
    max-width: 400px;
    max-height: 400px;
  }
  .confirm-btn{
    padding: 10px 20px;
	border: none;
	border-radius: 30px;
	background-color: #051e55;
	color: #fff;
	cursor: pointer;
	margin-top: 10px;
  }
  .confirmation-header {
    color: black;
    margin-bottom: 10%;
    font-size: large;
  }
  .confirmation-text {
    margin-top: 10%;
    color: black;
  }
  </style>