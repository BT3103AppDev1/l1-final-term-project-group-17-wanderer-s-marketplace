<template>
	<div class="page-container">
		<h1>Leave a Rating for @{{ this.ratedUsername }}</h1>
		<div class="rating-container">
			<div class="left">
				<ProductImage />
			</div>
			<div class="right">
				<div class="rating-stars">
					<span
						v-for="star in 5"
						:key="star"
						@click="ratingExists ? null : setRating(star)"
						:class="{ filled: star <= selectedRating, disabled: ratingExists }"
					>
						&#9733;
					</span>
				</div>
				<textarea
					id="comment"
					v-model="ratingComment"
					:disabled="ratingExists"
					placeholder="Leave a comment (optional)"
					:style="
						ratingExists ? { cursor: 'not-allowed' } : { cursor: 'pointer' }
					"
					maxlength="300"
					@keypress.enter.prevent
				/>
				<div style="text-align: right; font-size: 0.75rem">
					{{ 300 - ratingComment.length }} characters remaining
				</div>
				<button
					id="submit"
					type="button"
					:disabled="ratingExists"
					:class="{ 'submitted-button': ratingExists }"
					@click="leaveRating"
				>
					{{ ratingExists ? "Submitted" : "Submit" }}
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import ProductImage from "../components/listing_components/ProductImage.vue";
import firebaseApp from "../firebase.js";
import {
	getFirestore,
	doc,
	getDoc,
	collection,
	addDoc,
	query,
	where,
	getDocs,
} from "firebase/firestore";
const db = getFirestore(firebaseApp);
import { mapState } from "vuex";

export default {
	name: "LeaveRating",
	components: { ProductImage },
	data() {
		return {
			ratedUserID: "",
			ratedUsername: "",
			ratedByUserID: "",
			selectedRating: 0,
			ratingComment: "",
			ratingType: "",
			ratingDate: null,
			ratingExists: false,
			existingRating: null,
		};
	},
	computed: {
		...mapState(["currentListing", "user"]),
	},
	methods: {
		setRating(value) {
			this.selectedRating = this.selectedRating === value ? 0 : value;
			this.updateStarColors();
		},
		updateStarColors() {
			const stars = document.querySelectorAll(".rating-stars span");
			stars.forEach((star, index) => {
				if (this.selectedRating > 0 && index < this.selectedRating) {
					star.style.color = "#051e55";
				} else {
					star.style.color = "#ccc";
				}
			});
		},
		determineRatingType() {
			const listingUser = this.currentListing.userID;
			const offerUser = this.currentListing.acceptedOfferUserID;
			if (this.user.uid === listingUser) {
				this.ratedUserID = offerUser;
				this.ratingType = "Shopper";
			} else if (this.user.uid === offerUser) {
				this.ratedUserID = listingUser;
				this.ratingType = "Traveller";
			} else {
				console.log("ERROOROROROROOR");
			}
		},
		async leaveRating() {
			this.determineRatingType();
			const ratedByUsername = await this.fetchUsername(this.$root.user.uid);
			try {
				const docRef = await addDoc(collection(db, "Ratings"), {
					RatedUserID: this.ratedUserID,
					RatedByUserID: this.$root.user.uid,
					RatedByUsername: ratedByUsername,
					RatingValue: this.selectedRating,
					RatingComment: this.ratingComment,
					RatingType: this.ratingType,
					RatingDate: new Date().toISOString(),
					ListingID: this.currentListing.id,
				});
				console.log("Document written with ID: ", docRef.id);
				this.selectedRating = 0;
				this.ratingComment = "";
				this.$emit("added");
				this.$router.push("/home");
				alert("Thank you for your rating!");
			} catch (error) {
				console.error("Error adding document: ", error);
			}
		},
		async fetchUsername(userID) {
			if (!userID) return "";
			const userDocRef = doc(db, "Users", userID);
			try {
				const userDocSnapshot = await getDoc(userDocRef);
				if (userDocSnapshot.exists()) {
					const userData = userDocSnapshot.data();
					return userData.username;
				}
				return "";
			} catch (error) {
				console.error("Error fetching username:", error);
				return "";
			}
		},
		async checkForExistingRating() {
			try {
				const listingID = this.currentListing?.id; // replace with actual id property if different
				const ratedByUserID = this.$root.user.uid;
				let q = query(
					collection(db, "Ratings"),
					where("ListingID", "==", listingID),
					where("RatedByUserID", "==", ratedByUserID)
				);
				const querySnapshot = await getDocs(q);
				if (!querySnapshot.empty) {
					this.existingRating = querySnapshot.docs[0];
					this.selectedRating = this.existingRating.data().RatingValue;
					this.ratingComment = this.existingRating.data().RatingComment;
					this.ratingExists = true;
					this.updateStarColors();
				} else {
					this.ratingExists = false;
				}
			} catch (error) {
				console.error("Error getting documents: ", error);
			}
		},
	},
	async mounted() {
		this.updateStarColors();
		this.determineRatingType();
		this.ratedUsername = await this.fetchUsername(this.ratedUserID);
		await this.checkForExistingRating();
		console.log(this.user);
	},
};
</script>

<style scoped>
.rating-container {
	margin-top: 0%;
	display: flex;
	justify-content: center;
	align-items: stretch;
	padding: 50px;
}

.left {
	flex: 1;
}

.right {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
}

.rating-stars {
	font-size: 50px;
}

.rating-stars span {
	cursor: pointer;
	transition: transform 0.3s ease-in-out, text-shadow 0.3s ease;
}

.rating-stars span:hover {
	transform: translateY(-2px); /* Subtle lift effect */
	text-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.rating-stars span.disabled {
	cursor: not-allowed;
}

.rating-stars span.disabled:hover,
.submitted-button:hover {
	transform: none;
	box-shadow: none;
	text-shadow: none;
}

textarea {
	width: 100%;
	flex: 1;
	padding: 0.5rem;
	border-radius: 10px;
	border: 1px solid #ccc;
	margin: 10px 50px 10px 50px;
	background-color: #fff1e7;
}

button {
	padding: 12px 25px; /* Increased padding for a larger button */
	font-size: 15px; /* Larger font size for better visibility */
	border: none;
	border-radius: 30px; /* Slightly reduced radius for a modern look */
	background-color: #051e55;
	color: #fff;
	cursor: pointer;
	margin-top: 20px;
	margin-left: 10px;
	transition: transform 0.3s ease-in-out, box-shadow 0.3s ease; /* Smooth transition for movement and shadow */
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

button:hover {
	transform: translateY(-2px); /* Subtle lift effect */
	box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); /* Enhanced shadow for 3D effect */
}

.submitted-button {
	background-color: #818589; /* Replace with the exact color from the screenshot */
	color: #fff; /* Darker text color for contrast */
	cursor: not-allowed;
	box-shadow: none; /* Remove shadow to make it look truly disabled */
}
</style>
