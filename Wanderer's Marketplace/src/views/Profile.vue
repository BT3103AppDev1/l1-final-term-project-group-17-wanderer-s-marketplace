<template>
	<div id="container">
		<div id="FirstDiv">
			<h1 id="Username">@{{ username }}</h1>
			<button
				class="signout-button"
				type="button"
				v-on:click="signOut"
				v-if="isCurrentUser"
			>
				Logout
			</button>
		</div>
		<div id="SecondDiv">
			<UserProfile :userID="this.userID" />
		</div>
		<div id="ThirdDiv">
			<h1 id="EditDetails" v-if="isCurrentUser">Edit User Details</h1>
			<h1 id="OtherUserListings" v-else>@{{ username }}'s Listings</h1>
		</div>
		<div id="FourthDiv">
			<EditDetails :userID="this.userID" v-if="isCurrentUser" />
		</div>
	</div>
</template>

<script>
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import {
	getFirestore,
	collection,
	query,
	where,
	getDocs,
	doc,
	getDoc,
	updateDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import ProfilePhoto from "../components/profile_components/ProfilePhoto.vue";
import Rating from "../components/profile_components/Rating.vue";
import UserProfile from "../components/profile_components/UserProfile.vue";
import EditDetails from "../components/profile_components/EditDetails.vue";
const db = getFirestore();
const storage = getStorage();
import { mapState } from "vuex";

export default {
	name: "Profile",
	components: { ProfilePhoto, Rating, UserProfile, EditDetails },
	props: {
		userID: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			username: "",
			/* ratings: [],
			profilePhoto: "",
			dateJoined: "",
			telegramHandle: "",
			stripeUserID: "",
			averageRating: 0,
			numberOfRatings: 0,
			showCropperModal: false,
			cropper: null,
			croppedImage: null,
			cardholderName: "",
			cardNumber: "",
			CVV: "",
			expiryDate: "",
			initialTelegramHandle: "",
			initialStripeUserID: "",
			telegramHandleError: false,
			stripeUserIDError: false, */
		};
	},
	methods: {
		signOut() {
			const auth = getAuth();
			signOut(auth)
				.then(() => {
					console.log("User signed out");
					this.$root.user = null;
					this.$router.push("/");
				})
				.catch((error) => {
					console.error("Error signing out:", error);
				});
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
	computed: {
		...mapState(["currentListing", "user"]),
		isCurrentUser() {
			return this.user.uid === this.userID;
		},
	},
	async mounted() {
		this.username = await this.fetchUsername(this.userID);
	},
};
</script>

<style scoped>
#container {
	display: flex;
	flex-direction: column;
}

#FirstDiv,
#ThirdDiv {
	background-color: #051e55;
	height: 60px;
	display: flex;
	justify-content: center;
	align-items: center;
}
/* #FirstDiv {
	justify-content: space-between;
	padding: 0 20px;
} */

#Username {
	margin-left: 9%;
	flex-grow: 1; /* This will make the center div grow and take up the available space */
	display: flex;
	justify-content: center; /* This will center the username text */
	align-items: center;
}

#SecondDiv,
#FourthDiv {
	height: 360px;
	display: flex;
	justify-content: center;
	align-items: center;
}

h1 {
	color: white;
	margin-bottom: 18px;
}

.signout-button {
	background-color: #fff1e7;
	font-size: 20px;
	padding: 4px 20px;
	border-radius: 12px;
	border: none;
	display: inline-block;
	text-align: center;
	transition: all 0.5s;
	cursor: pointer;
	margin: 5px;
}
</style>
