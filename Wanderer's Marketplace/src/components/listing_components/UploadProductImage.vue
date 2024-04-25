<template>
	<div class="product-image">
		<div class="title">Upload Product Image</div>
		<div class="image-container">
			<img :src="imageSrc" alt="Product Image" />
			<br />
			<input type="file" @change="handleFileChange" accept="image/*" />
		</div>
	</div>
</template>

<script>
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default {
	name: "UploadProductImage",
	props: {
		imageSrc: {
			type: String,
			required: true, // Add a default value
		},
	},
	methods: {
		handleFileChange(event) {
			const file = event.target.files[0];
			if (file) {
				// Upload the file to Firebase Storage
				const storage = getStorage();
				const storageRef = ref(storage, "product-images/" + file.name);
				uploadBytes(storageRef, file)
					.then((snapshot) => {
						console.log("Uploaded a blob or file!");
						// Get the download URL
						getDownloadURL(snapshot.ref).then((downloadURL) => {
							console.log("File available at", downloadURL);
							// Emit the download URL
							this.$emit("update:imageSrc", downloadURL);
						});
					})
					.catch((error) => {
						console.error("Upload failed", error);
						// Handle any errors
					});
			}
		},
	},
};
</script>

<style scoped>
.product-image {
	background-color: #ffffff;
	border-radius: 20px;
	padding: 1rem;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
}

.title {
	font-size: 1.5rem;
	font-weight: bold;
	margin-bottom: 1rem;
}

.image-container {
	width: 100%;
	height: auto;
	border-radius: 10px;
	overflow: hidden;
}

.image-container img {
	width: 60%;
	height: auto;
	border-radius: 10px;
	justify-content: center;
}
</style>
