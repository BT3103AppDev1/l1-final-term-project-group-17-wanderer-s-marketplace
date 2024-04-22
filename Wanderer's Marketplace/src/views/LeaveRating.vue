<template>
	<div id="rating">
		<h1>Leave Rating</h1>
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
		<button id="submit" type="button" v-on:click="leaveRating">Submit</button>
	</div>
</template>

<script>
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
			const ratedUsername = await this.fetchUsername(this.ratedUserID)
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
.rating-stars {
	font-size: 24px;
}

.rating-stars span {
	cursor: pointer;
}

input {
	width: 100%;
	height: 100px;
	margin-top: 10px;
}

button {
	padding: 10px 20px;
	border: none;
	border-radius: 30px;
	background-color: #051e55;
	color: #fff;
	cursor: pointer;
	margin-top: 10px;
}
</style>
