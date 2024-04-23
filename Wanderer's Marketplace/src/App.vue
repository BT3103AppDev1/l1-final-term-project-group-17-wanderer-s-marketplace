<template>
	<div id="app">
		<div
			id="nav"
			v-if="
				user && !isLoginPage && !isCreateAccountPage && !isPasswordResetPage
			"
		>
			<!-- <img id="LogoTopLeft" src="/images/logo_with_words_2.png" alt="" /> -->
			<router-link to="/home"
				><img id="LogoTopLeft" src="/images/logo_with_words_2.png" alt=""
			/></router-link>
			<div id="nav-links">
				<router-link to="/home"> Home </router-link> |
				<router-link to="/marketplace"> Marketplace </router-link> |
				<router-link :to="`/profile/${user.uid}`"> Profile </router-link>
				<router-link :to="`/profile/${user.uid}`"
					><ProfilePhoto
						:userID="this.user.uid"
						:styleObject="{ width: '50px', height: '50px' }"
				/></router-link>
			</div>
		</div>
		<div
			id="content"
			:style="{
				paddingTop:
					user && !isLoginPage && !isCreateAccountPage && !isPasswordResetPage
						? '100px'
						: '0',
			}"
		>
			<router-view />
		</div>
	</div>
</template>

<script>
import { onAuthStateChanged, getAuth } from "firebase/auth";
import ProfilePhoto from "./components/profile_components/ProfilePhoto.vue";

export default {
	name: "App",
	components: { ProfilePhoto },
	data() {
		return {
			user: false,
			isLoginPage: false,
			isCreateAccountPage: false,
			isPasswordResetPage: false,
		};
	},
	mounted() {
		const auth = getAuth();
		onAuthStateChanged(auth, (user) => {
			if (user) {
				this.user = user;
			}
		});
		// Check if the current route is the login page
		this.isLoginPage = this.$route.path === "/";
		this.isCreateAccountPage = this.$route.path === "/createaccount";
		this.isPasswordResetPage = this.$route.path === "/passwordreset";
	},
	watch: {
		$route(to) {
			// Update isLoginPage when the route changes
			this.isLoginPage = to.path === "/";
			this.isCreateAccountPage = to.path === "/createaccount";
			this.isPasswordResetPage = to.path === "/passwordreset";
		},
	},
};
</script>

<style>
#LogoTopLeft {
	height: 80px;
}

#LogoTopLeft:hover {
	background-color: transparent;
}

#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 0px;
	display: flex;
	flex-direction: column;
	width: 100%;
	min-height: 100vh;
	background-color: #b3e3eb;
}

#nav {
	padding: 10px;
	height: 80px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1px solid #051e55;
	background-color: #ffffff;
	position: fixed;
	top: 0;
	width: calc(100% - 20px);
	z-index: 1000000; /* very high number */
}

#nav-links {
	display: flex;
	justify-content: flex-end;
	align-items: center;
}

#nav a {
	color: #2c3e50;
}

#nav a.router-link-exact-active {
	font-weight: bold;
	color: #051e55;
}

#content {
	flex: 1;
	padding-top: 100px;
}

body {
	margin: 0;
}
</style>
