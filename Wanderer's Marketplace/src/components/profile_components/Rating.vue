<template>
	<div class="rating-container">
		<div class="top">
			<ProfilePhoto
				:userID="ratedByUserID"
				:styleObject="{ width: '50px', height: '50px' }"
				:linkToProfile="true"
			/>
			<div class="top-right">
				<div class="username">@{{ ratedByUsername }}</div>
				<span class="star" v-for="i in 5" :key="i" :style="getStarStyle(i)"
					>&#9733;</span
				>
			</div>
		</div>
		<div v-if="ratingComment" class="comment">{{ ratingComment }}</div>
		<div class="rating-info">
			<span>Rating from {{ ratingType }} </span> |
			<span>{{ getTimeAgo(ratingDate) }}</span>
		</div>
	</div>
</template>

<script>
import ProfilePhoto from "../profile_components/ProfilePhoto.vue";

export default {
	components: { ProfilePhoto },
	props: {
		/* profilePhoto: {
			type: String,
			required: true,
		},*/
		ratedByUserID: {
			type: String,
			required: true,
		},
		ratedByUsername: {
			type: String,
			required: true,
		},
		ratingValue: {
			type: Number,
			required: true,
			validator: (val) => val >= 0 && val <= 5,
		},
		ratingComment: {
			type: String,
			default: "",
		},
		ratingType: {
			type: String,
			required: true,
		},
		ratingDate: {
			type: String, //date?
			required: true,
		},
	},
	methods: {
		getStarStyle(index) {
			return {
				color: index <= this.ratingValue ? "#051e55" : "#ccc",
			};
		},
		getTimeAgo(dateString) {
			const date = new Date(dateString);
			const now = new Date();
			const seconds = Math.round((now - date) / 1000);
			const minutes = Math.round(seconds / 60);
			const hours = Math.round(minutes / 60);
			const days = Math.round(hours / 24);
			const months = Math.round(days / 30);
			const years = Math.round(months / 12);

			if (seconds < 60) {
				return `${seconds} seconds ago`;
			} else if (minutes < 60) {
				return `${minutes} minutes ago`;
			} else if (hours < 24) {
				return `${hours} hours ago`;
			} else if (days < 30) {
				return `${days} days ago`;
			} else if (months < 12) {
				return `${months} months ago`;
			} else {
				return `${years} years ago`;
			}
		},
	},
};
</script>

<style scoped>
.rating-container {
	background-color: #fff1e7;
	border-radius: 20px;
	padding: 1rem;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
	text-align: left;
	width: 300px;
	height: auto;
	max-height: 250px;
	overflow-y: auto;
	overflow-x: hidden;
}

.top {
	display: flex;
	align-items: center;
}

.top-right {
	display: block;
	padding-left: 10px;
}

.username {
	font-weight: bold;
	word-wrap: break-word;
}

.star {
	font-size: 20px;
}

.comment {
	margin-top: 10px;
	word-wrap: break-word; /* Break words to prevent overflow */
	white-space: normal;
}

.rating-info {
	font-size: xx-small;
	margin-top: 10px;
}
</style>
