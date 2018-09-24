<template>
<div class="navbar" v-if="currentUser">
	<div class="info-box" v-if="currentUser.photoURL">
		<img :src="currentUser.photoURL" class="profile-pic">
		<div class="nav-info">{{ currentUser.displayName }}</div>
	</div>
	<div class="nav-info" v-else>{{ currentUser.email }}</div>
	<div class="banner" @click='goHome'>Podcast Vue</div>
	<button class="nav-item" @click="signOut">Sign Out</button>
</div>
<div class="navbar" v-else>
	<div class="empty"></div>
	<div class="banner" @click='goHome'>Podcast Vue</div>
	<div class="nav-item" @click='goLogin'>Log In</div>
</div>
</template>

<script>
import firebase from 'firebase'

export default {
	name: 'Navbar',
	computed: {
		currentUser() {
			return this.$store.getters.getUser;
		}
	},
	methods: {
		goHome: function() {
			this.$router.push("home");
		},
		goLogin: function() {
			this.$router.push("login");
		},
		signOut: function() {
			let router = this.$router;
			let store = this.$store;
			console.log("Signing out...");
			firebase.auth().signOut().then(function() {
				store.dispatch("setUserFromFirebaseAction")
				router.push("home");
			});
		}
	}
}
</script>

<style scoped>
.navbar {
	height: 50px;
	width: 100%;
	padding: 5px;
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	grid-template-rows: 40px;
	background-color: #2c2f34;
	align-items: center;
	justify-items: center;
	box-sizing: border-box;
	font-family: Lato, 'Helvetica Neue', Arial, Helvetica, sans-serif;
}

.info-box {
	display: flex;
	flex-direction: row;
	align-items: center;
	width: fit-content;
	margin-right: -100px;
}

.profile-pic {
	border-radius: 50%;
	height: 40px;
	width: 40px;
	object-fit: contain;
	margin-right: 10px;
}

.nav-item {
	background-color: black;
	height: 25px;
	display: inline-block;
	padding: 5px;
	border: 1px solid white;
	border-radius: 3px;
	box-sizing: content-box;
	vertical-align: middle;
	line-height: 25px;
	text-decoration: unset;
	color: white;
	cursor: pointer;
	text-align: center;
	width: fit-content;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}

.nav-info {
	font-weight: bold;
	color: white;
}

.banner {
	font-size: 2.75em;
	color: white;
	cursor: pointer;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	vertical-align: center;
	text-align: center;
}

@media (max-width: 360px) {
	.banner {
		font-size: 1.25em;
		font-weight: bold;
	}

	.nav-item {
		font-size: 0.75em;
	}
}
</style>
