<template>
	<div id="profile-section">
		<div
			id="user-profile"
			style="display: flex; align-items: center; margin-bottom: 10px; gap: 20px"
		>
			<ProfilePhoto
				:userID="this.userID"
				:linkToProfile="false"
				:profilePhoto="profilePhoto"
			/>
			<div
				id="user-info"
				style="
					display: flex;
					flex-direction: column;
					white-space: nowrap;
					text-align: center;
				"
			>
				<p style="margin: 0; font-weight: bold; font-size: 1em; color: #000000">
					Joined {{ dateJoined }}
				</p>
				<a
					:href="`https://t.me/${telegramHandle}`"
					target="_blank"
					class="telegram-link"
					style="
						margin: 0;
						font-weight: bold;
						font-size: 1em;
						color: #000000;
						text-decoration: none;
					"
				>
					Telegram @{{ telegramHandle }}
				</a>
			</div>
		</div>
		<div
			id="user-rating"
			style="display: flex; align-items: center; white-space: nowrap"
		>
			<div id="overall-rating" :style="{ marginRight: '10px' }">
				<h2 style="margin: 0">{{ averageRating.toFixed(1) }}</h2>
				<p style="margin: 0">({{ numberOfRatings }} ratings)</p>
			</div>
			<div class="stars">
				<span
					class="star"
					v-for="i in 5"
					:key="i"
					:class="{ filled: i <= averageRating }"
					:style="getStarStyle(i)"
					>&#9733;
				</span>
			</div>
		</div>
	</div>
	<div id="ratings-section" class="scroll">
		<div v-for="(rating, index) in ratings" :key="index">
			<Rating
				:ratedByUserID="rating.RatedByUserID"
				:ratedByUsername="rating.RatedByUsername"
				:ratingValue="rating.RatingValue"
				:ratingComment="rating.RatingComment"
				:ratingType="rating.RatingType"
				:ratingDate="rating.RatingDate"
			/>
		</div>
	</div>
</template>

<script>
import ProfilePhoto from "./ProfilePhoto.vue";
import Rating from "./Rating.vue";
import {
	getFirestore,
	doc,
	getDoc,
	collection,
	query,
	where,
	getDocs,
} from "firebase/firestore";
const db = getFirestore();
import { store } from "../../store/store.js";
import { watchEffect } from "vue";

export default {
	components: { ProfilePhoto, Rating },
	props: {
		userID: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			ratings: [],
			dateJoined: "",
			telegramHandle: "",
			averageRating: 0,
			numberOfRatings: 0,
		};
	},
	methods: {
		async fetchData() {
			this.fetchUserDetails();
			this.fetchRatings();
		},
		async fetchUserDetails() {
			if (this.userID) {
				const userDocRef = doc(db, "Users", this.userID);
				const userDocSnapshot = await getDoc(userDocRef);
				if (userDocSnapshot.exists()) {
					const userData = userDocSnapshot.data();
					this.telegramHandle = userData.telegramHandle;
					this.dateJoined = userData.dateJoined || "Not available";
				} else {
					console.error("User document does not exist for:", user.uid);
				}
			} else {
				console.log("No user found");
			}
		},
		async fetchRatings() {
			try {
				const ratingsRef = collection(db, "Ratings");
				const userRatingsQuery = query(
					ratingsRef,
					where("RatedUserID", "==", this.userID)
				);
				const querySnapshot = await getDocs(userRatingsQuery);
				let totalRatings = 0;
				this.ratings = querySnapshot.docs
					.map((doc) => {
						const data = doc.data();
						totalRatings += data.RatingValue;
						return data;
					})
					.sort(
						(a, b) =>
							new Date(b.RatingDate).getTime() -
							new Date(a.RatingDate).getTime()
					);
				this.numberOfRatings = this.ratings.length;
				if (this.numberOfRatings > 0) {
					this.averageRating = totalRatings / this.numberOfRatings;
				}
			} catch (error) {
				console.error("Error fetching ratings:", error);
			}
		},
		getStarStyle(index) {
			return {
				color: index <= this.averageRating ? "#051e55" : "#ccc",
			};
		},
	},
	watch: {
		userID(newVal) {
			if (newVal) {
				this.fetchData();
			}
		},
	},
	mounted() {
		this.fetchData();
		watchEffect(() => {
			if (store.userProfileUpdated) {
				this.fetchUserDetails();
				store.userProfileUpdated = false; // Reset the flag
			}
		});
	},
	computed: {
		profilePhoto() {
			return store.profilePhoto;
		},
	},
};
</script>

<style scoped>
#profile-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 20px;
}

#ratings-section {
	display: flex;
	gap: 20px;
	max-width: 100%;
	margin: 4px, 4px;
	padding: 4px;
	overflow-x: auto;
	overflow-y: hidden;
	white-space: nowrap;
	align-items: center;
}

.star {
	font-size: 30px;
}
</style>
