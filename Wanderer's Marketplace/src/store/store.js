/* import { createStore } from "vuex";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

@@ -12,94 +12,62 @@
	state: {
		user: null, // This will hold the logged-in user state
		currentListing: null, // Initialize currentListing
		userProfile: {
			profilePhoto: "",
		},
	},
	plugins: [createPersistedState({
		paths: ['user', 'currentListing', 'userProfile'], // Specify which parts of the state you want to persist
	  })],
	mutations: {
		setUser(state, user) {
			console.log("user setting");
			console.log(user);
			state.user = user;
		},
		setCurrentListing(state, listing) {
			state.currentListing = listing;
		},
		setUserProfile(state, userProfile) {
			state.userProfile = userProfile;
		},
	},
	actions: {
		initializeAuth({ commit }) {
			const auth = getAuth();
			onAuthStateChanged(auth, (user) => {
				commit("setUser", user);
				if (user) {
					this.dispatch("fetchUserProfile", user);
				}
			});
		},
		setCurrentListing({ commit }, listing) {
			commit("setCurrentListing", listing);
		},
		async fetchUserProfile({ commit }, user) {
			if (!user) {
				// Handle the case where the user is not logged in or is undefined
				console.error("User is not logged in or is undefined");
				return;
			}
			const userDocRef = doc(db, "Users", user.uid);
			try {
				const userDocSnapshot = await getDoc(userDocRef);
				if (userDocSnapshot.exists()) {
					commit("setUserProfile", {
						profilePhoto: userDocSnapshot.data().profilePhoto,
					});
				}
			} catch (error) {
				console.error("Error fetching user profile:", error);
			}
		},
		async uploadProfilePhoto({ commit, state }, file) {
			const storageRef = ref(
				storage,
				`profile-photos/${state.user.uid}/${file.name}`
			);
			try {
				await uploadBytes(storageRef, file);
				const downloadURL = await getDownloadURL(storageRef);
				await updateDoc(doc(db, "Users", state.user.uid), {
					profilePhoto: downloadURL,
				});
				commit("setUserProfile", { profilePhoto: downloadURL });
				console.log("File uploaded successfully:", downloadURL);
			} catch (error) {
				console.error("Error uploading file:", error);
			}
		},
	},
}); */

import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import { reactive } from "vue";

export default createStore({
	state: {
		user: null, // This will hold the logged-in user state
		currentListing: null, // Initialize currentListing
	},
	plugins: [
		createPersistedState({
			paths: ["user", "currentListing"], // Specify which parts of the state you want to persist
		}),
	],
	mutations: {
		setUser(state, user) {
			console.log("user setting");
			console.log(user);
			state.user = user;
		},
		setCurrentListing(state, listing) {
			state.currentListing = listing;
		},
	},
	actions: {
		fetchUser({ commit }, user) {
			commit("setUser", user);
		},
		setCurrentListing({ commit }, listing) {
			commit("setCurrentListing", listing);
		},
	},
});

export const store = reactive({
	userProfileUpdated: false,
});
