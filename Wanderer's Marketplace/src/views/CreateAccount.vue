<template>
	<div class="container">
		<div class="login-logo">
			<img src="/images/logo_with_words.png" alt="Logo" />
		</div>
		<div class="signup-form">
			<h2>Create Your Account</h2>
			<div class="form-group">
				<label for="username">Username</label>
				<input
					type="text"
					id="username"
					name="username"
					class="input-field"
					v-model="username"
				/>
			</div>
			<div class="form-group">
				<label for="email">Email Address</label>
				<input
					type="email"
					id="email"
					name="email"
					class="input-field"
					v-model="email"
				/>
			</div>
			<div class="form-group">
				<label for="password">Password</label>
				<input
					type="password"
					id="password"
					name="password"
					class="input-field"
					v-model="password"
				/>
			</div>
			<div class="form-group">
				<label for="confirmPassword">Confirm Password</label>
				<input
					type="password"
					id="confirmPassword"
					name="confirmPassword"
					class="input-field"
					v-model="confirmPassword"
				/>
				<span v-if="passwordsMatch" class="password-match"
					>Passwords match!</span
				>
				<span
					v-else-if="confirmPassword !== '' && confirmPassword !== password"
					class="password-mismatch"
					>Passwords do not match!</span
				>
			</div>
			<!--
				<div class="form-group">
					<label for="cardholderName">Cardholder Name</label>
					<input
						type="text"
						id="cardholderName"
						name="cardholderName"
						class="input-field"
						v-model="cardholderName"
					/>
				</div>
				<div class="form-group">
					<label for="cardNumber">Card Number</label>
					<input
						type="text"
						id="cardNumber"
						name="cardNumber"
						class="input-field"
						v-model="cardNumber"
					/>
				</div>
				<div class="form-group">
					<label for="CVV">CVV</label>
					<input
						type="text"
						id="CVV"
						name="CVV"
						class="input-field"
						v-model="CVV"
					/>
				</div>
				<div class="form-group">
					<label for="expiryDate">Expiry Date</label>
					<input
						type="month"
						id="expiryDate"
						name="expiryDate"
						class="input-field"
						v-model="expiryDate"
					/>
				</div>
				-->
			<div class="form-group">
				<label for="telegramHandle">Telegram Handle</label>
				<input
					type="text"
					id="telegramHandle"
					name="telegramHandle"
					class="input-field"
					v-model="telegramHandle"
				/>
			</div>
			<button class="createaccount-button" @click="signUp($event)">
				Create Account
			</button>
			<div class="error-box" v-if="error">
				<div class="error-message">{{ error }}</div>
			</div>
			<div class="additional-text">
				<p>
					Already have an account?<router-link to="/" class="login-link"
						>Login here</router-link
					>
				</p>
			</div>
		</div>
	</div>
</template>

<script>
import {
	getAuth,
	createUserWithEmailAndPassword,
	sendEmailVerification,
	onAuthStateChanged,
} from "firebase/auth";
import { countries } from "countries-list";
import app from "../firebase.js";
import firebaseApp from "../firebase.js";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import { query, where, collection, getDocs } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export default {
	name: "CreateAccount",
	data() {
		return {
			email: "",
			password: "",
			confirmPassword: "",
			//country: '',
			countryNames: [],
			//cardholderName: "",
			//cardNumber: "",
			//CVV: "",
			//expiryDate: "",
			telegramHandle: "",
			error: "",
			user: null,
			defaultPhotoURL: "",
			stripeUserID: "",
		};
	},
	computed: {
		passwordsMatch() {
			return (
				this.confirmPassword !== "" && this.confirmPassword === this.password
			);
		},
	},
	mounted() {
		//this.countryNames = Object.values(countries).map(country => country.name);
		//this.countryNames.sort();
		const auth = getAuth();
		onAuthStateChanged(auth, (user) => {
			console.log("Authentication state changed: ", user.email);
			if (user) {
				this.user = user;
				console.log("User is logged in");
			} else {
				console.log("User is not logged in.");
			}
		});
		const defaultPhotoRef = ref(storage, "profile-photos/default.png");
		getDownloadURL(defaultPhotoRef)
			.then((url) => {
				this.defaultPhotoURL = url;
			})
			.catch((error) => {
				console.error("Failed to load default profile photo URL", error);
			});
	},
	methods: {
		async checkStripeAccountId(accountId) {
			try {
				// Replace 'http://backendserver.com' with the actual domain where your Node.js backend is hosted
				const response = await fetch(
					`https://bt3103clone.vercel.app/check-stripe-account/${accountId}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
					}
				);
				const data = await response.json();

				if (response.ok) {
					console.log("Stripe account is valid:", data.account);
					// Handle successful validation
				} else {
					console.error("Stripe account validation failed:", data.error);
					// Handle validation failure
				}
			} catch (error) {
				console.error("Error calling the API:", error);
				// Handle network errors or other unexpected errors
			}
		},
		async createStripeConnectedAccount() {
			try {
				const response = await fetch(
					"https://bt3103clone.vercel.app/create-stripe-account",
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ email: this.email }),
					}
				);
				const data = await response.json();
				if (response.ok) {
					return data.accountId;
				} else {
					throw new Error(data.error || "Failed to create Stripe account");
				}
			} catch (error) {
				console.error("Error creating Stripe account:", error.message);
				throw error; // Rethrow to handle it in signUp method
			}
		},
		async generateStripeLink(accountId) {
			try {
				const response = await fetch(
					"https://bt3103clone.vercel.app/create-account-link",
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ accountId: accountId }),
					}
				);
				const data = await response.json();
				if (response.ok) {
					return data.url;
				} else {
					throw new Error(
						data.error || "Failed to generate remediation link for account"
					);
				}
			} catch (error) {
				console.error("Error to generate stripe link:", error.message);
				throw error; // Rethrow to handle it in signUp method
			}
		},
		isValidEmail(email) {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			return emailRegex.test(email);
		},
		isValidPassword(password) {
			// Check if password length is at least 8 characters
			if (password.length < 8) {
				return false;
			}

			// Check if password contains at least one uppercase letter
			if (!/[A-Z]/.test(password)) {
				return false;
			}

			// Check if password contains at least one lowercase letter
			if (!/[a-z]/.test(password)) {
				return false;
			}

			// Check if password contains at least one number
			if (!/\d/.test(password)) {
				return false;
			}

			// Check if password contains at least one special character
			if (!/[$&+,:;=?@#|'<>.^*()%!-]/.test(password)) {
				return false;
			}

			return true;
		},

		async signUp() {
			event.preventDefault();
			try {
				// Check if the username is empty or contains only spaces
				if (!this.username || this.username.trim() === "") {
					throw new Error("Please provide a valid username.");
				}
				// Check if the username is already taken
				const usernameExists = await this.checkUsernameAvailability(
					this.username
				);
				if (usernameExists) {
					throw new Error(
						"Username is already taken. Please choose a different one."
					);
				}
				// Check if the email address is valid
				if (!this.isValidEmail(this.email)) {
					throw new Error(
						"Invalid email format. Please provide a valid email address."
					);
				}
				// Check if the password is empty or contains only spaces
				if (!this.password || this.password.trim() === "") {
					throw new Error("Please provide a valid password.");
				}
				if (!this.isValidPassword(this.password)) {
					throw new Error(
						"Password should be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character."
					);
				}
				// Check if the password and confirm password match
				if (this.password !== this.confirmPassword) {
					throw new Error("Passwords do not match!");
				}
				// Check if the cardholder name is empty or contains only spaces
				// if (!this.cardholderName || this.cardholderName.trim() === "") {
				// 	throw new Error("Please provide a valid cardholder name.");
				// }
				// // Check if the card number is empty or contains only spaces
				// if (!this.cardNumber || this.cardNumber.trim() === "") {
				// 	throw new Error("Please provide a valid card number.");
				// }
				// // Check if the card number contains only numbers
				// if (!/^\d+$/.test(this.cardNumber)) {
				// 	throw new Error("Card number must contain numbers only.");
				// }
				// // Check if the CVV is empty or contains only spaces
				// if (!this.CVV || this.CVV.trim() === "") {
				// 	throw new Error("Please provide a valid CVV.");
				// }
				// // Check if CVV has exactly three digits
				// if (!/^\d{3}$/.test(this.CVV)) {
				// 	throw new Error("CVV must be a 3-digit number.");
				// }
				// // Check if the expiry date is filled in
				// if (!this.expiryDate) {
				// 	throw new Error("Please provide an expiry date.");
				// }
				// Check if the telegram handle is empty or contains only spaces
				if (!this.telegramHandle || this.telegramHandle.trim() === "") {
					throw new Error("Please provide a valid Telegram handle.");
				}
				// Call the Firebase createUserWithEmailAndPassword method to create a new user
				const auth = getAuth();
				const { user } = await createUserWithEmailAndPassword(
					auth,
					this.email,
					this.password
				);

				// Send email verification
				await sendEmailVerification(user);

				// Show alert after verification email is sent
				alert(
					"Verification email sent! Please check your inbox and verify your email before logging in."
				);
				const accountId = await this.createStripeConnectedAccount();
				this.stripeUserID = accountId;
				const res = await this.generateStripeLink(accountId);
				if (!this.stripeUserID || this.stripeUserID.trim() === "") {
					throw new Error("Please provide a valid Stripe User Id.");
				}
				this.checkStripeAccountId(this.stripeUserID);

				const creationTime = userCredential.user.metadata.creationTime;

				// Format creation time to date or use as is, depending on your needs
				// For example, to convert to a Date object:
				const dateJoined = new Date(creationTime).toLocaleDateString("en-GB");
				// Save user details to Firestore
				//const db = app.firestore();
				await setDoc(doc(db, "Users", user.uid), {
					userID: user.uid,
					username: this.username,
					email: this.email,
					//cardholderName: this.cardholderName,
					//cardNumber: this.cardNumber,
					//CVV: this.CVV,
					//expiryDate: this.expiryDate,
					telegramHandle: this.telegramHandle,
					profilePhoto: this.defaultPhotoURL,
					stripeUserID: this.stripeUserID,
					dateJoined: dateJoined,
				});
				// If account creation is successful, redirect to home or login page
				window.location.href = res;

				// this.$router.push("/");
			} catch (error) {
				// Handle account creation errors here
				if (error.code === "auth/invalid-email") {
					this.error =
						"Invalid email format. Please provide a valid email address."; // Custom error message for invalid email
				} else if (error.code === "auth/weak-password") {
					this.error = "Password should be at least 6 characters long."; // Custom error message for weak password
				} else if (error.code === "auth/email-already-in-use") {
					this.error =
						"The email address is already in use. Please use a different email address."; // Custom error message for email already in use
				} else {
					this.error = error.message; // Use default error message for other errors
				}
				console.error("Error creating account:", error.message);
			}
		},
		async checkUsernameAvailability(username) {
			try {
				// Query Firestore to check if the username exists
				const q = query(
					collection(db, "Users"),
					where("username", "==", username)
				);
				const querySnapshot = await getDocs(q);
				return querySnapshot.size > 0; // Return true if username exists, false otherwise
			} catch (error) {
				console.error("Error checking username availability:", error.message);
				return false; // Return false in case of any error
			}
		},
	},
};
</script>

<style>
.container {
	display: flex;
	justify-content: center; /* Align center horizontally */
	align-items: center; /* Align center vertically */
	height: 100vh; /* Ensure container takes up full viewport height */
}

.login-logo {
	width: 50%;
}

.login-logo img {
	width: 70%; /* Make sure image fills its container */
	height: auto; /* Maintain aspect ratio */
}

.signup-form {
	flex: 1; /* Take up remaining space */
	position: relative;
	display: flex;
	flex-direction: column;
	width: 300px;
	height: 100%;
	align-items: center;
	justify-content: center;
	height: 100%;
}

.signup-form::before {
	content: "";
	position: absolute;
	top: 0px;
	bottom: 0px; /* Extend the line to the bottom of the container */
	left: 0%; /* Position the line at the center horizontally */
	width: 2px; /* Width of the line */
	background-color: #051e55; /* Color of the line */
}
/*
  form {
    text-align: center;
    align-items: center;
    margin: auto;
  }
  */
.form-group {
	display: flex;
	flex-direction: column;
	text-align: left;
	margin-bottom: 20px;
	align-items: flex-start;
}

.form-group label {
	margin-bottom: 5px;
}

.input-field {
	width: 300px; /* Adjust the width of the input fields */
	box-sizing: border-box;
}

.createaccount-button {
	padding: 10px 20px;
	background-color: #051e55;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	font-size: 14px;
	width: 300px;
}
.error-box {
	background-color: #ffcccc; /* Red background color */
	border: 1px solid #ff3333; /* Red border */
	border-radius: 4px; /* Rounded corners */
	padding: 8px 20px; /* Add some padding */
	margin-top: 20px; /* Add some space above the error box */
	width: 260px;
	font-size: 14px;
	margin: 20px auto;
}

.error-message {
	color: #ff3333; /* Red text color */
}

.additional-text {
	text-align: center;
}

.login-link {
	font-size: 15px;
	color: #051e55;
	font-weight: bold;
}

.password-match {
	color: green;
	margin-top: 20px;
}

.password-mismatch {
	color: #ff3333;
	margin-top: 20px;
}
</style>
