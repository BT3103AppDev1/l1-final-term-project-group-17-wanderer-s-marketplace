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
		userID: {
			immediate: true,
			handler: "fetchProfilePhoto",
		},
	},
	mounted() {
		watchEffect(() => {
			if (store.userProfileUpdated) {
				this.fetchProfilePhoto();
				store.userProfileUpdated = false; // Reset the flag
			}
		});
	},
};
/* import { mapState } from "vuex";

export default {
	props: {
		containerClass: {
			type: String,
			default: "",
		},
	},
	computed: {
		...mapState({
			profilePhoto: (state) => state.userProfile.profilePhoto,
		}),
	},
	created() {
		if (!this.profilePhoto) {
			this.$store.dispatch("fetchUserProfile");
		}
	},
}; */

/* import { onAuthStateChanged, getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
const db = getFirestore();

export default {
	props: { profilePhoto: string },
	data() {
		return {
			profilePhoto: "",
		};
	},
	mounted() {
		this.fetchProfilePhoto();
	},
	methods: {
		fetchProfilePhoto() {
			const auth = getAuth();
			onAuthStateChanged(auth, async (user) => {
				if (user) {
					try {
						const userDocRef = doc(db, "Users", user.uid);
						const userDocSnapshot = await getDoc(userDocRef);
						if (userDocSnapshot.exists()) {
							const userData = userDocSnapshot.data();
							this.profilePhoto = userData.profilePhoto;
						}
					} catch (error) {
						console.error("Error fetching profile photo:", error);
					}
				}
			});
		},
	},
}; */
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
