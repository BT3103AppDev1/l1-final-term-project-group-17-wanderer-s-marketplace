<script>
import HomeListings from "@/components/home_components/HomeListings.vue";
import HelpingListings from "@/components/home_components/HelpingListings.vue";
import { mapState } from "vuex";

export default {
	name: "Home",
	components: {
		HomeListings,
		HelpingListings,
	},
	computed: {
		...mapState(["user"]),
	},
};
</script>

<template>
	<div id="container">
		<div id="FirstDiv">
			<h1 id="YourPurchases">Your Purchases</h1>
			<router-link to="/addnewlisting"
				><button class="button" id="AddNewListingButton" type="button">
					<span>Add New Listing</span>
				</button></router-link
			>
		</div>

		<div id="SecondDiv" class="scroll">
			<HomeListings :userID="this.user.uid"/>
		</div>

		<div id="ThirdDiv">
			<h1 id="GoodsYouAreHelpingToBuy">Goods You Are Helping To Buy</h1>
		</div>

		<div id="FourthDiv" class="scroll">
			<HelpingListings :userID="this.user.uid" />
		</div>
	</div>
</template>

<style>
#container {
	display: flex;
	flex-direction: column;
}

#YourPurchases,
#GoodsYouAreHelpingToBuy {
	color: white;
	margin-bottom: 18px;
}

#FirstDiv,
#ThirdDiv {
	background-color: #051e55;
	height: 60px;
	display: flex;
	justify-content: center;
	align-items: center;
}
#FirstDiv {
	display: flex;
	justify-content: space-between; /* This will space out the logo, username, and logout button */
	align-items: center;
	padding: 0 20px; /* Adjust padding as needed */
	/* Other styles... */
}

#YourPurchases {
	flex-grow: 1; /* This will make the center div grow and take up the available space */
	margin-left: 14%;
	display: flex;
	justify-content: center; /* This will center the username text */
	align-items: center;
}

#SecondDiv,
#FourthDiv {
	height: 360px;
	display: flex;
	justify-content: left;
	align-items: center;
}

h1 {
	margin: 0;
}

div.scroll {
	margin: 4px, 4px;
	padding: 4px;
	/*width: 300px;*/
	overflow-x: auto;
	overflow-y: hidden;
	white-space: nowrap;
}

#AddNewListingButton {
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

.button span {
	cursor: pointer;
	display: inline-block;
	position: relative;
	transition: 0.5s;
}

.button span:after {
	content: "\00bb";
	position: absolute;
	opacity: 0;
	top: 0;
	right: -20px;
	transition: 0.5s;
}

.button:hover span {
	padding-right: 25px;
}

.button:hover span:after {
	opacity: 1;
	right: 0;
}
</style>
