import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import CreateAccount from "@/views/CreateAccount.vue";
import PasswordReset from "@/views/PasswordReset.vue";
import Home from "@/views/Home.vue";
import Marketplace from "@/views/Marketplace.vue";
import Profile from "@/views/Profile.vue";
import ListingCompleted from "@/views/ListingCompleted.vue";
import AddNewListing from "@/views/AddNewListing.vue";
import ListingDetail from "@/views/ListingDetail.vue";
import ListingDetailAction from "@/views/ListingDetailAction.vue";
import LeaveRating from "@/views/LeaveRating.vue";
import AvailableListingShopper from "@/views/AvailableListingShopper.vue";
import ListingOfferAction from "@/views/ListingOfferAction.vue";
import Payment from "@/views/Payment.vue";
import ListingConfirmDeliveryAction from "@/views/ListingConfirmDeliveryAction.vue";
import ListingConfirmPurchaseAction from "@/views/ListingConfirmPurchaseAction.vue";
import PaymentSuccess from "../views/PaymentSuccess.vue";


const routes = [
	{
		path: "/",
		name: "Login",
		component: Login,
	},
	{
		path: "/createaccount",
		name: "CreateAccount",
		component: CreateAccount,
	},
	{
		path: "/passwordreset",
		name: "PasswordReset",
		component: PasswordReset,
	},
	{
		path: "/home",
		name: "Home",
		component: Home,
	},
	{
		path: "/marketplace",
		name: "Marketplace",
		component: Marketplace,
	},
	{
		path: "/profile",
		name: "Profile",
		component: Profile,
	},
	{
		path: "/listingcompleted",
		name: "ListingCompleted",
		component: ListingCompleted,
	},
	{
		path: "/addnewlisting",
		name: "AddNewListing",
		component: AddNewListing,
	},
	{
		path: "/listingdetail",
		name: "ListingDetail",
		component: ListingDetail,
	},
	{
		path: "/listingdetailaction",
		name: "ListingDetailAction",
		component: ListingDetailAction,
	},
	{
		path: "/leaverating/:listingUser/:offerUser",
		name: "LeaveRating",
		component: LeaveRating,
	},
	{
		path: "/availablelistingshopper",
		name: "AvailableListingShopper",
		component: AvailableListingShopper,
	},
	{
		path: "/listingofferaction",
		name: "ListingOfferAction",
		component: ListingOfferAction,
	},
	{
		path: "/payment/:offerId",
		name: "Payment",
		component: Payment,
	},
	{
		path: "/listingconfirmdeliveryaction",
		name: "ListingConfirmDeliveryAction",
		component: ListingConfirmDeliveryAction,
	},
	{
		path: "/listingconfirmpurchaseaction",
		name: "ListingConfirmPurchaseAction",
		component: ListingConfirmPurchaseAction,
	},
	{
		path: "/payment-success",
		name: "PaymentSuccess",
		component: PaymentSuccess,
		props: true,
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
