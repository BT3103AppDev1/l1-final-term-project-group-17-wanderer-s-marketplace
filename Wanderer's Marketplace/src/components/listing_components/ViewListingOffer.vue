<template>
	<div class="view-offers-page-container">
		<div class="offers-and-details-container">
			<div class="offers-list-container">
				<div class="listing-details">
					<h2>Offers</h2>
					<h2 class="listing-title">{{ listing.title }}</h2>
					<p class="listing-status">{{ listing.status }}</p>
				</div>
				<!-- Check if offers array has elements -->
				<div v-if="offers.length > 0" class="offers-container">
					<div
						v-for="offer in offers"
						:key="offer.id"
						:class="{
							'offer-card': true,
							selected: selectedOffer && offer.id === selectedOffer.id,
						}"
						@click="selectOffer(offer)"
					>
						<!-- <img
							:src="getUserImageUrl(offer.OfferByUserID)"
							alt="User Image"
							class="user-image"
						/> -->
						<ProfilePhoto
							:userID="offer.OfferByUserID"
							:styleObject="{ width: '80px', height: '80px' }"
						/>
						<div class="offer-info">
							<p class="user-name">{{ getUserName(offer.OfferByUserID) }}</p>
							<p class="offer-price">Offered: ${{ offer.OfferPrice }}</p>
						</div>
					</div>
				</div>
				<!-- Display message when there are no offers -->
				<div v-else class="no-offers-message">No offers listed yet.</div>
			</div>
			<div v-if="selectedOffer" class="selected-offer-details">
				<div class="selected-user-info">
					<!-- <img
						:src="getUserImageUrl(selectedOffer.OfferByUserID)"
						alt="User Image"
						class="selected-user-image"
					/> -->
					<ProfilePhoto
						:userID="selectedOffer.OfferByUserID"
						:styleObject="{ width: '80px', height: '80px' }"
						
					/>
					<div class="selected-user-details">
						<h2 class="selected-user-name">
							{{ getUserName(selectedOffer.OfferByUserID) }}
						</h2>
						<p class="selected-user-telegram-id">
							<span class="telegram-label">Telegram: </span>
							<a
								:href="`https://t.me/${getUserTelegramId(
									selectedOffer.OfferByUserID
								)}`"
								target="_blank"
								>{{ getUserTelegramId(selectedOffer.OfferByUserID) }}</a
							>
						</p>
					</div>
				</div>
				<div class="selected-offer-amount">
					<h2 class="selected-user-text">has offered</h2>
					<div class="offer-amount">$ {{ selectedOffer.OfferPrice }}</div>
					<div class="offer-actions">
						<button
							class="action-button accept-button"
							@click="acceptOffer(selectedOffer)"
						>
							Accept
						</button>
						<button
							class="action-button reject-button"
							@click="rejectOffer(selectedOffer)"
						>
							Reject
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from "vuex";
import firebaseApp from "../../firebase.js";
import {
	getFirestore,
	doc,
	getDoc,
	updateDoc,
	collection,
	query,
	where,
	getDocs,
} from "firebase/firestore";
import { deleteDoc } from "firebase/firestore";
import ProfilePhoto from "../profile_components/ProfilePhoto.vue";

export default {
	name: "ViewListingOffers",
	components: { ProfilePhoto },
	computed: {
		...mapState(["currentListing"]),
		listingId() {
			// Ensure that the ID is correctly retrieved from your Vuex state
			return this.currentListing?.id;
		},
	},
	data() {
		return {
			listing: {},
			offers: [],
			selectedOffer: null,
			users: {}, // Initialize as an object
		};
	},
	created() {
		// Use the computed property here
		this.fetchData();
	},
	methods: {
		async acceptOffer(offer) {
			if (!this.selectedOffer) {
				alert("No offer has been selected!");
				return;
			}
			const listingDocRef = doc(
				getFirestore(firebaseApp),
				"Listings",
				this.listingId
			);
			try {
				await updateDoc(listingDocRef, {
					acceptedOfferUserID: offer.OfferByUserID,
				});
				// const listingDocRef = doc(getFirestore(firebaseApp), "Listings", this.listingId);
				// try {
				//   await updateDoc(listingDocRef, {
				//     ListingStatus: "Accepted"
				//   });
				console.log(offer.OfferID);
				alert(`Accepted Offer $${offer.OfferPrice}`);
				this.$router.push({
					name: "Payment",
					params: { offerId: this.selectedOffer.OfferID }, // Ensure the offer ID is correctly passed here
				});
			} catch (error) {
				console.error("Error accepting offer:", error);
			}
			// } catch (error) {
			//   console.error("Error updating listing status:", error);
			// }
		},
		async rejectOffer(offer) {
			// Assuming offer.id is the ID of the offer document
			const offerDocRef = doc(getFirestore(firebaseApp), "Offers", offer.id);
			try {
				await deleteDoc(offerDocRef); // Delete the offer document
				// You might want to also remove the offer from the list or show a message
				alert(`Rejected Offer $${offer.OfferPrice}`); // Show an alert message
				// Remove the offer from the offers array
				this.offers = this.offers.filter((o) => o.id !== offer.id);
				this.$router.push("/home");
			} catch (error) {
				console.error("Error deleting offer:", error);
			}
		},
		async selectOffer(offer) {
			if (Object.keys(this.users).length === 0) {
				await this.fetchUsers();
			}
			this.selectedOffer = offer;
		},
		async fetchData() {
			if (this.listingId) {
				await this.fetchListing();
				await this.fetchOffers();
				await this.fetchUsers();
			} else {
				console.error("No listing ID provided");
			}
		},
		async fetchListing() {
			try {
				const docRef = doc(
					getFirestore(firebaseApp),
					"Listings",
					this.listingId
				);
				const docSnap = await getDoc(docRef);
				if (docSnap.exists() && docSnap.data()) {
					this.listing = {
						...docSnap.data(),
						id: docRef.id, // Add the document ID to the listing object
					};
				} else {
					console.error("No such listing!");
				}
			} catch (error) {
				console.error("Error fetching listing:", error);
			}
		},
		async fetchOffers() {
			if (!this.listingId) {
				console.error("Listing ID is undefined");
				return;
			}
			try {
				const offersCollectionRef = collection(
					getFirestore(firebaseApp),
					"Offers"
				);
				const q = query(
					offersCollectionRef,
					where("ListingID", "==", this.listingId)
				);
				const querySnapshot = await getDocs(q);
				this.offers = querySnapshot.docs.map((doc) => ({
					...doc.data(),
					id: doc.id, // Add the document ID to each offer
				}));
			} catch (error) {
				console.error("Error fetching offers:", error);
			}
		},
		async fetchUsers() {
			try {
				const usersCollectionRef = collection(
					getFirestore(firebaseApp),
					"Users"
				);
				const querySnapshot = await getDocs(usersCollectionRef);
				querySnapshot.forEach((doc) => {
					// Directly assign the fetched data to the users object
					this.users[doc.id] = doc.data();
				});
			} catch (error) {
				console.error("Error fetching users:", error);
			}
		},
		getUserTelegramId(userId) {
			// Retrieve the Telegram ID from the user's details
			return this.users[userId]?.telegramHandle || "No Telegram ID";
		},

		getUserName(userId) {
			// Revised to use object notation
			return this.users[userId]?.username;
		},
		getUserImageUrl(userId) {
			// Revised to use object notation
			return this.users[userId]?.profilePhoto || "default-profile.jpg";
		},
		// acceptOffer and rejectOffer methods remain the same
	},
};
</script>

<style scoped>
.view-offers-page-container {
	display: flex;
	justify-content: center;
	padding: 20px;
	background: #fff1e7;
	border-radius: 16px;
	width: 100%;
	box-sizing: border-box;
}

.offers-and-details-container {
	display: flex;
	max-width: 1200px;
	width: 100%;
	border-radius: 16px;
}

.offers-list-container {
	background-color: none;
	width: 50%;
}
.selected-offer-details {
	width: 50%;
	padding: 20px;
	border-radius: 16px;
	box-sizing: border-box;
	background-color: white;
	height: 350px;
	margin-top: 100px;
	margin-right: 20px;
}

.offers-list-container {
	margin-right: 0px; /* Adjust space between offers and details */
}

.listing-details {
	text-align: left;
	margin-bottom: 20px;
	font-size: 20px;
	font-weight: bolder;
	margin-left: 20px;
}

.offer-card {
	display: flex;
	align-items: center;
	padding: 10px;
	margin-bottom: 10px;
	background: white;
	border: 1px solid #ccc;
	border-radius: 14px;
	transition: background-color 0.3s;
	width: 70%;
}

.offer-info {
	display: flex;
	flex-direction: column;
	justify-content: left;
	margin-left: 10px;
	white-space: normal; /* This allows the text to wrap */
	overflow: scroll; /* This makes sure that text is not hidden */
}

.selected-user-details {
	display: flex;
	flex-direction: column;
	justify-content: left;
	margin-left: 10px;
	white-space: normal; /* This allows the text to wrap */
	overflow: scroll; /* This makes sure that text is not hidden */
}

.user-image {
	width: 70px;
	height: 70px;
	border-radius: 50%;
	margin-right: 10px;
}

.action-button {
	padding: 10px 20px;
	margin-top: 50px;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	font-size: 1em;
}

.accept-button {
	background-color: #4caf50;
	color: white;
	margin-right: 10px;
	border-radius: 10px;
	width: 40%;
}

.reject-button {
	background-color: #f44336;
	color: white;
	border-radius: 10px;
	width: 40%;
}

.selected-user-info {
	display: flex;
	flex-direction: row;
	align-items: left;
	margin-bottom: 20px;
	margin-left: 0px;
	justify-content: left;
}

.selected-user-image {
	width: 80px;
	height: 80px;
	border-radius: 50%;
	border: 2px solid #ddd;
	margin-bottom: 0px;
}

.selected-user-name {
	font-size: 20px;
	margin-bottom: 0px;
}
.telegram-label {
	margin-right: 4px;
	font-weight: bold;
	margin-bottom: 0px;
}

.selected-user-telegram-id {
	display: flex;
	align-items: center;
	font-size: 14px;
	color: #555;
	margin-bottom: 0px;
	margin-top: 0px;
}

.offer-amount {
	margin-bottom: 5px;
	margin-top: 0px;
	font-size: 40px;
	font-weight: bold;
}

.selected-user-text {
	margin-bottom: 0px;
	margin-top: 0px;
}

.selected-offer-amount {
	margin-bottom: 0px;
	margin-top: 0px;
}

.offer-card.selected {
	background-color: #051e55;
	color: white;
}

.no-offers-message {
	text-align: center;
	font-size: 35px;
	color: #c1271f;
	font-weight: bold;
}

.user-name {
	font-size: 18px;
	margin-bottom: 5px;
	margin-top: 0px;
	font-weight: bolder;
}

.offer-price {
	font-size: 18px;
	margin-top: 5px;
	margin-bottom: 0px;
}

.selected-user-telegram-id a {
	color: #4f5151; /* Telegram's brand color, you can choose a different color if you want */
	text-decoration: none; /* Removes the underline */
	transition: font-weight 0.2s; /* Smooth transition for the font weight */
	margin-left: 0px;
	font-weight: light;
}

.selected-user-telegram-id a:hover,
.selected-user-telegram-id a:active {
	font-weight: bolder; /* Makes the text bold on hover and when active (pressed) */
	text-decoration: none; /* Optional: adds underline on hover */
	margin-left: 0px;
	margin-bottom: 0px;
}

.telegram-label {
	margin-right: 0px;
	margin-left: 0px;
	font-size: 18px;
	margin-bottom: 0px;
}
.offers-container {
	overflow-y: auto; /* Enable vertical scrolling */
	max-height: 400px;
}
</style>
3
