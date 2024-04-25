<template>
	<div class="product-name-header">
		<h1>{{ productDetails.name }}</h1>
		<div class="listing-user-details">
			<router-link
				:to="`/profile/${listingUser.userID}`"
				v-if="listingUser.userID"
				class="profile-link"
			>
				@{{ this.listingUser.username }} </router-link
			><span v-else> @{{ listingUser.username }} </span>
			<p style="margin-left: 10px">|</p>
			<a
				:href="`https://t.me/${listingUser.telegramHandle}`"
				target="_blank"
				class="telegram-link"
			>
				Telegram @{{ this.listingUser.telegramHandle }}
			</a>
		</div>
	</div>
	<div class="product-details-container">
		<div class="left">
			<ProductImage :imageSrc="productDetails.imageUrl" />
		</div>
		<div class="right">
			<ProductDetailsViewing :product-details="productDetails" />
			<div
				v-if="productDetails.listingStatus === 'Accepted'"
				class="accepted-offer-container"
			>
				<div class="accepted-offer-header">
					<div class="accepted-offer-label">Accepted Offer:</div>
					<div class="accepted-offer-detail-box">
						<router-link
							:to="`/profile/${acceptedOfferDetails.userID}`"
							class="detail"
						>
							Username: <span>{{ acceptedOfferDetails.username }}</span>
						</router-link>
					</div>
					<div class="accepted-offer-detail-box">
						<a
							:href="`https://t.me/${acceptedOfferDetails.telegram}`"
							class="detail"
							target="_blank"
							>Telegram: <span>{{ acceptedOfferDetails.telegram }}</span></a
						>
					</div>
					<div class="accepted-offer-detail-box">
						<div class="detail">
							Offer Price: <span>${{ acceptedOfferDetails.offerPrice }}</span>
						</div>
					</div>
				</div>
			</div>
			<div class="buttons-container">
				<button
					v-if="
						productDetails.listingStatus === 'Available' &&
						!hasPendingOffer &&
						this.productDetails.userID != user.uid
					"
					class="action-button"
					@click="extendOffer"
				>
					Extend Offer
				</button>
				<button
					v-if="hasPendingOffer && productDetails.listingStatus === 'Available'"
					class="action-button pending-offer"
					disabled
				>
					Pending Offer
				</button>
				<button
					v-if="
						productDetails.listingStatus === 'Accepted' &&
						acceptedOfferDetails.userID == user.uid
					"
					class="action-button"
					@click="confirmPurchase"
				>
					Mark as Purchased
				</button>
				<button
					v-if="
						productDetails.listingStatus === 'Purchased' &&
						this.productDetails.userID == user.uid
					"
					class="action-button"
					@click="confirmDelivery"
				>
					Confirm Delivery
				</button>
				<button
					v-if="productDetails.listingStatus === 'Completed' &&
						(this.productDetails.userID == user.uid || acceptedOfferDetails.userID == user.uid)
					"
					class="action-button"
					@click="leaveRating"
				>
					Leave Rating
				</button>
				<button
					v-if="
						productDetails.listingStatus === 'Available' &&
						this.productDetails.userID == user.uid
					"
					class="action-button"
					@click="deleteListing"
				>
					Delete Listing
				</button>
				<button
					v-if="
						productDetails.listingStatus === 'Available' &&
						this.productDetails.userID == user.uid
					"
					class="action-button"
					@click="viewOffers"
				>
					View Offers
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import ProductImage from "../components/listing_components/ProductImage.vue";
import ProductDetailsViewing from "../components/listing_components/ProductDetailsViewing.vue";
import firebaseApp from "@/firebase.js";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";
const db = getFirestore(firebaseApp);
import { collection, query, where, getDocs, getDoc } from "firebase/firestore";
import { getStorage, ref as storageRef, deleteObject } from "firebase/storage";
import { mapState } from "vuex";

export default {
	name: "ListingDetail",
	components: { ProductImage, ProductDetailsViewing },
	data() {
		return {
			// ...other data properties
			hasPendingOffer: false, // This will track whether a pending offer exists
			acceptedOffer: null,
			offerUser: null,
			listingUser: null,
			offer: null,
		};
	},
	watch: {
		currentListing(newVal, oldVal) {
			if (newVal !== oldVal) {
				this.checkForExistingOffer();
			}
		},
		"productDetails.listingStatus": function (newVal) {
			if (newVal === "Accepted") {
				this.fetchAcceptedOffer();
			}
		},
		user(newVal, oldVal) {
			if (newVal !== oldVal) {
				this.checkForExistingOffer();
			}
		},
	},
	created() {
		this.fetchUserDetails(this.productDetails.userID);
		this.checkForExistingOffer();
	},
	mounted() {
		this.fetchAcceptedOffer();
	},
	computed: {
		...mapState(["currentListing", "user"]),
		productDetails() {
			// Use the currentListing from Vuex as the product details
			// or return a default object structure if currentListing is null/undefined
			console.log("currlisting", this.currentListing);
			return (
				this.currentListing || {
					name: "Loading...",
					quantity: 0,
					color: "",
					size: "",
					currency: "",
					minPrice: 0,
					maxPrice: 0,
					deliveryDate: "",
					country: "",
					listingStatus: "Available",
					userID: "",
				}
			);
		},
		acceptedOfferDetails() {
			if (!this.acceptedOffer || !this.offerUser) {
				return {
					username: "Loading...",
					telegram: "Loading...",
					offerPrice: "Loading...",
				};
			}
			return {
				username: this.offerUser.username,
				telegram: this.offerUser.telegramHandle,
				offerPrice: this.acceptedOffer.OfferPrice,
				userID: this.offerUser.userID,
			};

		},
		isCurrentUserTheLister() {
			//checks whether the current listing is created by the current user
			console.log("Current user:", this.user.uid);
			console.log("Listing user:", this.productDetails.userID);
			return (
				this.user &&
				this.productDetails &&
				this.user.uid === this.productDetails.userID
			);
		},
		isTraveller() {
			return this.user.uid === this.productDetails.UserID;
		},

		buttonConfig() {
			// If there is a pending offer, return the configuration for the non-clickable button
			if (this.hasPendingOffer) {
				return {
					label: "Pending Offer",
					action: () => {}, // An empty function so the button does nothing when clicked
				};
			}
			//change button according to state of listings
			const stateConfigs = {
				Completed: {
					label: "Leave Rating",
					action: this.leaveRating,
				},
				Available: {
					label: "Extend Offer",
					action: this.extendOffer,
				},
				Accepted: {
					label: "Confirm Purchase",
					action: this.confirmPurchase,
				},
				Purchased: {
					label: "Confirm Delivery",
					action: this.confirmDelivery,
				},
			};
			return stateConfigs[this.currentListing?.listingStatus] || {};
		},
	},
	methods: {
		leaveRating() {
			this.$router.push({ name: "LeaveRating" });
		},
		extendOffer() {
			this.$router.push({ name: "ListingDetailAction" });
		},
		viewOffers() {
			this.$router.push({ name: "ListingOfferAction" });
		},
		confirmPurchase() {
			this.$router.push({ name: "ListingConfirmPurchaseAction" });
		},
		confirmDelivery() {
			this.$router.push({ name: "ListingConfirmDeliveryAction" });
		},
		deleteImage() {
			const storage = getStorage(firebaseApp);

			const imageRef = storageRef(storage, this.productDetails.imageUrl);
			deleteObject(imageRef).then(() => {
				console.log("Image deleted successfully");
			});
			alert("Listing deleted successfully.");
			this.$router.push({ name: "Home" }); // Navigate to Home after deletion
		},

		deleteListing() {
			//delete the current listing
			const db = getFirestore(firebaseApp);
			const listingId = this.productDetails.id; // Make sure this is the correct ID

			if (!listingId) {
				alert("No valid listing ID found.");
				return;
			}

			const docRef = doc(db, "Listings", listingId);
			deleteDoc(docRef)
				.then(() => {
					console.log("Listing deleted successfully");
				})
				.catch((error) => {
					console.error("Failed to delete the listing:", error);
				});

			this.deleteImage();
		},

		async fetchAcceptedOffer() {
			//get the offer object which is for the current Listing which is accepted
			console.log("productdetailsnifonv:", this.productDetails);
			if (this.productDetails.listingStatus === "Accepted") {
				try {
					const offersRef = collection(db, "Offers");
					const q = query(
						offersRef,
						where("ListingID", "==", this.productDetails.id),
						where("OfferStatus", "==", "Accepted")
					);
					console.log("products user id", this.productDetails.userID);

					const querySnapshot = await getDocs(q);
					if (!querySnapshot.empty) {
						this.acceptedOffer = querySnapshot.docs[0].data();
						const offerUserID = this.acceptedOffer.OfferByUserID;
						await this.fetchOfferUser(offerUserID);
						await this.fetchUserDetails(this.productDetails.userID);
					} else {
						console.error("No accepted offers found for this listing.");
						this.acceptedOffer = null;
					}
				} catch (error) {
					console.error("Error fetching accepted offer:", error);
					this.acceptedOffer = null;
				}
			}
		},
		async fetchOfferUser(userID) {
			try {
				const userRef = doc(db, "Users", userID);
				const userSnap = await getDoc(userRef);

				if (userSnap.exists()) {
					this.offerUser = userSnap.data();
					console.log("thisistheofferuser:", this.offerUser);
				} else {
					console.error("No user found for ID:", userID);
					this.offerUser = null;
				}
			} catch (error) {
				console.error("Error fetching user:", error);
				this.offerUser = null;
			}
		},

		async fetchUserDetails(userID) {
			try {
				const userRef = doc(db, "Users", userID);
				const userSnap = await getDoc(userRef);

				if (userSnap.exists()) {
					this.listingUser = userSnap.data();
					console.log("thisisthelistinguser:", this.listingUser);
				} else {
					console.error("No user found for ID:", userID);
					this.listingUser = null;
				}
			} catch (error) {
				console.error("Error fetching user:", error);
				this.listingUser = null;
			}
		},
		async checkForExistingOffer() {
			try {
				const listingID = this.currentListing?.id;
				const userID = this.user?.uid; 
				let q = query(
					collection(db, "Offers"),
					where("ListingID", "==", listingID)
				);
				q = query(q, where("OfferByUserID", "==", userID));

				const querySnapshot = await getDocs(q);
				//check whether there is already an offer made for this listing made by this user, if so this listing will be shown as "pending offer"
				this.hasPendingOffer = !querySnapshot.empty;
	
				console.log(this.offer);
				console.log("showing offer");
			} catch (error) {
				console.error("Error getting documents: ", error);
			}
		},
	},
};
</script>

<style scoped>
.action-button.pending-offer {
	background-color: #818589; 
	color: #fff; 
	cursor: not-allowed;
	box-shadow: none; 
}

.action-button.pending-offer:hover {
	transform: none;
	box-shadow: none;
	text-shadow: none;
}

.product-details-container {
	display: flex;
	justify-content: center;
	align-items: stretch;
	padding: 20px 50px 50px 50px;
	margin: auto;
	width: auto;
	gap: 5%;
}

.product-name-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	text-align: center;
	padding: 20px 50px 0px 50px;
}

.product-name-header h1 {
	margin: 0;
}

.product-name-header a {
	color: inherit;
}

.left,
.right {
	padding: 10px;
	max-width: 50%;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.accepted-offer-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
}

.accepted-offer-header {
	background-color: #ffa500;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 15px;
	margin-top: 20px;
	height: 50px;
	width: 100%;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
	padding-inline: 20px;
	padding-block: 5px;
}
.accepted-offer-detail-box {
	background-color: white;
	border-radius: 10px;
	padding: 10px;
	display: flex;
	align-items: center;
	margin-left: 10px;
	width: auto;
	flex-shrink: 2;
	height: 20px;
	justify-content: center;
}

.accepted-offer-label {
	font-size: 16px;
	font-weight: bold;
}

.accepted-offer-details {
	background-color: white;
	border-radius: 10px;
	display: flex;
	justify-content: center;
	padding: 10px;
	margin-top: 10px; /* Space from label to details */
	width: max-content;
}

.detail {
	color: #333;
	font-weight: bold;
	font-size: 14px;
	justify-content: center;
}
.detail > span {
	font-weight: normal;
}

.action-button {
	padding: 12px 25px; /* Increased padding for a larger button */
	font-size: 15px; /* Larger font size for better visibility */
	border: none;
	border-radius: 30px; /* Slightly reduced radius for a modern look */
	background-color: #051e55;
	color: #fff;
	cursor: pointer;
	margin-top: 20px;
	transition: transform 0.3s ease-in-out, box-shadow 0.3s ease; /* Smooth transition for movement and shadow */
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	margin-inline: 5px;
}

.action-button:hover {
	transform: translateY(-2px); /* Subtle lift effect */
	box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); /* Enhanced shadow for 3D effect */
}

.buttons-container {
	display: flex;
	justify-content: center;
	gap: 5%;
	width: 100%;
}

.listing-user-details {
	display: flex;
	align-items: center;
	font-size: 20px;
}

.listing-user-details .profile-link,
.listing-user-details .telegram-link {
	font-size: inherit;
}
</style>
