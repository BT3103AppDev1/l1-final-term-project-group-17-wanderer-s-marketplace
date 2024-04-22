<template>
	<div class="page-container">
		<h1>Leave a Rating</h1>
		<div class="rating-container">
			<div class="left">
				<ProductImage />
			</div>
			<div class="right">
				<div class="rating-stars">
					<span
						v-for="star in 5"
						:key="star"
						@click="setRating(star)"
						:class="{ filled: star <= selectedRating }"
					>
						&#9733;
					</span>
				</div>
				<input
					type="text"
					id="comment"
					v-model="ratingComment"
					placeholder="Leave a comment (optional)"
				/>
				<button id="submit" type="button" v-on:click="leaveRating">
					Submit
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
} from "firebase/firestore";
const db = getFirestore(firebaseApp);

export default {
	name: "LeaveRating",
	components: { ProductImage },
	data() {
		return {
			ratedUserID: "",
			ratedByUserID: "",
			selectedRating: 0,
			ratingComment: "",
			ratingType: "",
			ratingDate: null,
			listingUser: this.$route.params.listingUser,
			offerUser: this.$route.params.offerUser,
		};
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
			if (this.$store.state.user.uid === this.listingUser) {
				// this.ratedUserID = "sUuhpdVawzZzuOdhrCBSNjROFyE2";
				this.ratedUserID = this.offerUser;
				this.ratingType = "Shopper";
			} else if (this.$store.state.user.uid === this.offerUser) {
				this.ratedUserID = this.listingUser;
				this.ratingType = "Traveller";
			} else {
				this.ratedUserID = this.listingUser;
				this.ratingType = "Traveller";
				console.log("ERROOROROROROOR");
			}
		},
		async leaveRating() {
			this.determineRatingType();
			const ratedUsername = await this.fetchUsername(this.ratedUserID);
			const ratedByUsername = await this.fetchUsername(this.$root.user.uid);
			try {
				const docRef = await addDoc(collection(db, "Ratings"), {
					RatedUserID: this.ratedUserID,
					RatedUsername: ratedUsername,
					RatedByUserID: this.$root.user.uid,
					RatedByUsername: ratedByUsername,
					RatingValue: this.selectedRating,
					RatingComment: this.ratingComment,
					RatingType: this.ratingType,
					RatingDate: new Date().toISOString(),
				});
				console.log("Document written with ID: ", docRef.id);
				this.selectedRating = 0;
				this.ratingComment = "";
				this.$emit("added");
				this.$router.push("/home");
				alert("You have successfully left a rating for: " + ratedUsername);
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
	},
	mounted() {
		this.updateStarColors();
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

input {
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
</style>
