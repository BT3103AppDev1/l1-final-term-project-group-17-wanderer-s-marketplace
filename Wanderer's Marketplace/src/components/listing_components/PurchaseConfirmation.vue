<template>
	<div class="confirmation-card">
		<div class="confirmation-header"><b>Confirmation of Purchase</b></div>
		<div class="confirmation-body">
			<div class="proof-purchase">
				<div class="proof-text"><b>Proof of Purchase</b></div>
				<div class="upload-container">
					<!-- Label for the file input -->
					<label for="file-upload" class="upload-label">
						<img
							src="/icons/favicon_io/upload icon.png"
							alt="Upload Icon"
							class="upload-icon"
						/>
					</label>
					<!-- Hidden file input, triggered by label click -->
					<input
						type="file"
						id="file-upload"
						@change="handleFileChange"
						accept="image/*"
						hidden
					/>
					<!-- Icon or image goes here 
                  <img v-if="!receiptImageUrl" src="/icons/favicon_io/document icon.png"  alt="Document Icon" class="document-icon">
                  -->
					<!-- Display uploaded image if available -->
					<img
						v-if="receiptImageUrl"
						:src="receiptImageUrl"
						@load="imageLoaded"
						alt="Uploaded receipt image"
						class="uploaded-receipt"
					/>
				</div>
			</div>
			<div class="confirmation-text">
				I confirm that I have purchased <br />
				authentic products as requested.
			</div>
			<button class="confirm-btn" @click="confirmPurchase">
				Update as Purchased
			</button>
		</div>
	</div>
</template>
<script>
// ... other imports
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { mapState } from "vuex";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseApp from "@/firebase.js";
import { collection, query, where, getDocs } from "firebase/firestore";

export default {
	name: "PurchaseConfirmation",
	computed: {
		...mapState(["currentListing"]),
		listingId() {
			// Ensure that the ID is correctly retrieved from your Vuex state
			return this.currentListing?.id;
		},
	},
	// ... other options
	data() {
		return {
			// ... other data properties
			receiptImageUrl: null,
			offer: null, // Placeholder for the current offer object
		};
	},
	created() {
		this.getOffer();
		const auth = getAuth();
		onAuthStateChanged(auth, (user) => {
			console.log("Authentication state changed: ", user.email);
			if (user) {
				this.userUID = user.uid;
				console.log("User is logged in");
				// this.fetchProducts(); // Fetch products once user is logged in
			} else {
				console.log("User is not logged in.");
			}
		});
	},
	methods: {
		// Method to retrieve the current offer from state

		imageLoaded() {
			console.log("Image has loaded!");
		},
		async getOffer() {
			const auth = getAuth();
			const user = auth.currentUser;

			if (user) {
				const db = getFirestore(firebaseApp);
				const offersRef = collection(db, "Offers"); //check
				const q = query(
					offersRef,
					where("ListingID", "==", this.$store.state.currentListing.id), //check
					where("OfferByUserID", "==", user.uid)
				);

				try {
					const querySnapshot = await getDocs(q);
					const offers = querySnapshot.docs.map((doc) => ({
						id: doc.id,
						...doc.data(),
					}));
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
		// ... other methods
		handleFileChange(event) {
			const file = event.target.files[0];
			if (file && this.offer) {
				const storage = getStorage();
				const storageRef = ref(
					storage,
					`receipts/${this.offer.OfferID}/${file.name}`
				); //check
				uploadBytes(storageRef, file)
					.then((snapshot) => {
						getDownloadURL(snapshot.ref).then((downloadURL) => {
							this.updateOfferWithImage(downloadURL);
						});
					})
					.catch((error) => {
						console.error("Upload failed", error);
					});
			}
		},
		// Method to update the offer with the image URL
		async updateOfferWithImage(imageUrl) {
			this.receiptImageUrl = imageUrl;
			const offerDocRef = doc(
				getFirestore(firebaseApp),
				"Offers",
				this.offer.OfferID
			);
			try {
				await updateDoc(offerDocRef, {
					PurchaseProofImage: imageUrl,
				});
				this.$emit("confirmedPurchase", this.listing);
				// this.$router.push('/home');
				console.log("Offer updated with image URL", this.receiptImageUrl);
			} catch (error) {
				console.error("Error updating offer with image:", error);
			}
		},
		// ... other methods
		async confirmPurchase() {
			if (!this.receiptImageUrl) {
				alert("Please upload Proof of Purchase.");
			} else {
				try {
					// Update the offer with the image URL
					if (this.receiptImageUrl) {
						await this.updateOfferWithImage(this.receiptImageUrl);
					}
					// Update the listing status to "Purchased"
					const listingDocRef = doc(
						getFirestore(firebaseApp),
						"Listings",
						this.$store.state.currentListing.id
					);
					await updateDoc(listingDocRef, {
						ListingStatus: "Purchased",
					});
					console.log('Listing status updated to "Purchased"');
					// Redirect to the home page
					alert(`Purchase Confirmed!`);
					this.$router.push({ name: "Home" }); // Use the correct route name for your home page
				} catch (error) {
					console.error("Error confirming purchase:", error);
				}
			}
		},
	},
};
</script>

<style scoped>
.confirmation-card {
	background-color: #ffffff;
	border-radius: 20px;
	padding: 1rem;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
}
.document-container {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 10px;
}
.proof-purchase {
	background-color: #fff1e7;
	padding: 1rem;
	padding-bottom: 4rem;
	border-radius: 10px;
	height: auto;
}

.confirm-btn {
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
}

.confirm-btn:hover {
	transform: translateY(-2px); /* Subtle lift effect */
	box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); /* Enhanced shadow for 3D effect */
}
.confirmation-header {
	margin-bottom: 10%;
}
.confirmation-text {
	margin-top: 10%;
}
.upload-container {
	position: relative;
	text-align: center;
	margin-top: 20px; /* Adjust as needed */
	display: flex; /* Use flexbox for alignment */
	flex-direction: column; /* Stack children vertically */
	align-items: center; /* Center children horizontally */
}

.upload-label {
	display: inline-block;
	cursor: pointer; /* Add cursor interaction */
	padding: 0; /* Remove padding */
	border: none; /* Remove border */
	background-color: transparent; /* Make background transparent */
	margin-top: 10%;
}

.uploaded-receipt {
	max-width: 150px; /* Adjust as needed to match the size of the left image */
	max-height: 150px; /* Adjust as needed to maintain aspect ratio */
	border-radius: 5px;
	margin-top: 10px;
	object-fit: contain; /* This will ensure the image is resized within the dimensions, maintaining aspect ratio without being cropped */
}
.document-icon,
.uploaded-receipt {
	/* Apply the same width and height to both for consistency */
	width: 150px; /* Adjust as needed */
	height: 150px; /* Adjust as needed */
	object-fit: contain;
	display: block; /* Make these block elements */
	margin: 0 auto; /* Auto margins for horizontal centering */
}
.upload-icon {
	width: 3rem;
	height: auto;
}
</style>
