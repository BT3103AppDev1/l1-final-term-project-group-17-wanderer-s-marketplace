<template>
	<router-link
		:to="`/profile/${userID}`"
		v-if="linkToProfile"
		:class="['profile-photo-container', containerClass]"
	>
		<img
			:src="profilePhoto"
			alt="Profile Photo"
			class="profile-photo"
			:style="styleObject"
		/>
	</router-link>
	<div v-else :class="['profile-photo-container', containerClass]">
		<img
			:src="profilePhoto"
			alt="Profile Photo"
			class="profile-photo"
			:style="styleObject"
		/>
	</div>
</template>

<script>
import firebaseApp from "../../firebase.js";
import { getFirestore, doc, getDoc } from "firebase/firestore";
const db = getFirestore(firebaseApp);
import { store } from "../../store/store.js";
import { watchEffect } from "vue";
import { mapState } from "vuex";

export default {
	props: {
		userID: { type: String, required: true },
		styleObject: Object,
		linkToProfile: { type: Boolean, default: true },
	},
	data() {
		return {
			profilePhoto: "",
		};
	},
	computed: {
		...mapState(["profilePhotoUpdated"]),
	},
	methods: {
		async fetchProfilePhoto() {
			if (!this.userID) return;
			const userDocRef = doc(db, "Users", this.userID);
			try {
				const userDocSnapshot = await getDoc(userDocRef);
				if (userDocSnapshot.exists()) {
					const userData = userDocSnapshot.data();
					this.profilePhoto = userData.profilePhoto;
				}
			} catch (error) {
				console.error("Error fetching profile photo:", error);
			}
		},
	},
	watch: {
		userID() {
			this.fetchProfilePhoto();
		},
		profilePhotoUpdated(newValue) {
			if (newValue) {
				this.fetchProfilePhoto();
			}
		},
	},
	mounted() {
		this.fetchProfilePhoto();
	},
};
</script>

<style scoped>
.profile-photo {
	width: 100px;
	height: 100px;
	border-radius: 50%;
	border: 1px solid black;
	object-fit: cover;
}
</style>
