<template>
	<div id="edit-profile-photo">
		<ProfilePhoto :userID="userID" :linkToProfile="false" />
		<button @click="triggerFileInput" class="edit-photo-button">
			Edit Profile Photo
		</button>
		<input
			type="file"
			id="inputImage"
			@change="handleFileChange"
			class="hidden"
			ref="fileInput"
			accept="image/*"
		/>
		<div v-if="showCropperModal" class="cropper-modal-wrapper">
			<div v-if="showCropperModal" class="cropper-modal">
				<img ref="imageElement" />
				<div class="cropper-buttons">
					<button @click="getCroppedImageAndUpload" class="upload-button">
						Upload
					</button>
					<button @click="cancelCropping" class="cancel-button">Cancel</button>
				</div>
			</div>
		</div>
	</div>
	<div id="edit-text-input">
		<label for="telegramHandle">Telegram Handle</label>
		<input
			type="text"
			id="telegramHandle"
			name="telegramHandle"
			v-model="telegramHandle"
			:class="{
				edited: telegramHandleChanged,
			}"
		/>
		<label for="stripeUserID">Stripe User ID</label>
		<input
			type="text"
			id="stripeUserID"
			name="stripeUserID"
			v-model="stripeUserID"
			:class="{ edited: stripeUserIDChanged }"
		/>
		<br />
		<button @click="confirmEdits" class="edit-details-button">
			Confirm Edits
		</button>
	</div>
</template>

<script>
import ProfilePhoto from "./ProfilePhoto.vue";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.min.css";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const db = getFirestore();
const storage = getStorage();
import { store } from "../../store/store.js";

export default {
	components: { ProfilePhoto },
	props: {
		userID: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			telegramHandle: "",
			stripeUserID: "",
			showCropperModal: false,
			cropper: null,
			croppedImage: null,
			initialTelegramHandle: "",
			initialStripeUserID: "",
			telegramHandleError: false,
			stripeUserIDError: false,
		};
	},
	methods: {
		async fetchUserDetails() {
			if (this.userID) {
				const userDocRef = doc(db, "Users", this.userID);
				const userDocSnapshot = await getDoc(userDocRef);
				if (userDocSnapshot.exists()) {
					const userData = userDocSnapshot.data();
					this.telegramHandle = userData.telegramHandle;
					this.stripeUserID = userData.stripeUserID;
					this.initialTelegramHandle = userData.telegramHandle;
					this.initialStripeUserID = userData.stripeUserID;
				} else {
					console.error("User document does not exist for:", this.userID);
				}
			} else {
				console.log("No user found");
			}
		},
		triggerFileInput() {
			this.$refs.fileInput.click();
		},
		handleFileChange(event) {
			const file = event.target.files[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = (e) => {
					this.showCropperModal = true;
					this.$nextTick(() => {
						this.cropper = new Cropper(this.$refs.imageElement, {
							aspectRatio: 1,
							viewMode: 1,
							modal: false,
							guides: true,
							center: true,
							highlight: true,
							background: false,
							autoCrop: true,
							cropBoxMovable: true,
							cropBoxResizable: true,
						});
						this.cropper.replace(e.target.result);
					});
				};
				reader.readAsDataURL(file);
			}
		},
		getCroppedImageAndUpload() {
			if (this.cropper) {
				const originalFile = this.$refs.fileInput.files[0];
				this.cropper.getCroppedCanvas().toBlob(async (blob) => {
					const file = new File([blob], originalFile.name, {
						type: originalFile.type,
					});
					await this.uploadCroppedImage(file);
					this.showCropperModal = false;
					this.resetFileInput();
				}, originalFile.type);
			}
		},
		async uploadCroppedImage(file) {
			try {
				const storageRef = ref(
					storage,
					`profile-photos/${this.userID}/${file.name}`
				);
				const uploadTask = await uploadBytes(storageRef, file);
				const downloadURL = await getDownloadURL(uploadTask.ref);

				await updateDoc(doc(db, "Users", this.userID), {
					profilePhoto: downloadURL,
				});
				store.userProfileUpdated = true;
				console.log("File uploaded successfully:", downloadURL);
				alert("Your profile photo has been updated successfully.");
			} catch (error) {
				console.error("Error uploading file:", error);
			}
		},
		cancelCropping() {
			this.showCropperModal = false;
			this.resetFileInput();
		},
		resetFileInput() {
			this.$refs.fileInput.value = ""; // Reset the file input
		},
		async confirmEdits() {
			this.validateTelegramHandle();
			await this.validateStripeUserID(this.stripeUserID);
			if (this.telegramHandleError || this.stripeUserIDError) {
				alert(
					"Please provide a valid Telegram handle and a valid Stripe User ID."
				);
				this.telegramHandle = this.initialTelegramHandle;
				this.stripeUserID = this.initialStripeUserID;
				return;
			}
			try {
				await updateDoc(doc(db, "Users", this.userID), {
					telegramHandle: this.telegramHandle,
					stripeUserID: this.stripeUserID,
				});
				this.initialTelegramHandle = this.telegramHandle;
				this.initialStripeUserID = this.stripeUserID;
				store.userProfileUpdated = true;
				alert("Your details have been updated successfully.");
			} catch (error) {
				console.error("Error updating user details:", error);
				alert("There was an error updating your details.");
			}
		},
		validateTelegramHandle() {
			if (!this.telegramHandle || this.telegramHandle.trim() === "") {
				this.telegramHandleError = true;
			} else {
				this.telegramHandleError = false;
			}
		},
		async validateStripeUserID(accountId) {
			console.log("accountId", accountId);
			try {
				const response = await fetch(
					// `http://localhost:3000/check-stripe-account/${accountId}`,
					`https://bt3103clone.vercel.app/check-stripe-account/${accountId}`,
					{
						method: "GET",
						headers: { "Content-Type": "application/json" },
					}
				);
				console.log("data", response);
				const data = await response.json();
				if (!response.ok) throw new Error(data.error);
				this.stripeUserIDError = false;
				console.log("stripe account validation success!");
			} catch (error) {
				console.error("Stripe account validation failed:", error);
				this.stripeUserIDError = true;
			}
		},
	},
	mounted() {
		this.fetchUserDetails();
	},
	computed: {
		telegramHandleChanged() {
			return this.telegramHandle !== this.initialTelegramHandle;
		},
		stripeUserIDChanged() {
			return this.stripeUserID !== this.initialStripeUserID;
		},
	},
};
</script>

<style scoped>
.edit-photo-button,
.edit-details-button {
	padding: 12px 25px; /* Increased padding for a larger button */
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

.upload-button {
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
	border: 2px solid #051e55;
}

.cancel-button {
	padding: 12px 25px; /* Increased padding for a larger button */
	font-size: 15px; /* Larger font size for better visibility */
	border: none;
	border-radius: 30px; /* Slightly reduced radius for a modern look */
	background-color: #fff;
	color: #051e55;
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

.hidden {
	display: none;
}

input {
	color: grey;
	width: 300px;
	margin-bottom: 10px;
}

label {
	display: block;
	text-align: left;
}

.edited {
	color: black;
}

.error-message {
	color: red;
	font-size: 14px;
	margin-left: 5px;
}

#edit-profile-photo {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20px;
}

.cropper-modal-wrapper {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	z-index: 100;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.8);
}

.cropper-modal {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	z-index: 101;
	width: auto;
	height: 80vh;
	background-color: rgba(0, 0, 0, 0);
	opacity: 1;
	margin: auto;
}

.cropper-modal img {
	max-height: 100%;
	max-width: none;
	object-fit: contain;
}
</style>
