<template>
<div id="nav" v-if="currentUser">
	<div class="info-box" v-if="currentUser.photoURL">
		<img :src="currentUser.photoURL" class="profile-pic">
		<div class="nav-info">{{ currentUser.displayName }}</div>
	</div>
	<div class="nav-info" v-else>{{ currentUser.email }}</div>
	<div class="banner" @click='goHome'>Podcast Vue</div>
	<button class="nav-item" @click="signOut">Sign Out</button>
</div>
<div id="nav" v-else>
	<div class="nav-item" @click='goLogin'>Login</div>
	<div class="banner" @click='goHome'>Podcast Vue</div>
	<div class="nav-item" @click='goSignup'>Sign Up</div>
</div>
</template>

<script>
import firebase from 'firebase'

export default {
	name: 'Navbar',
	data: function () {
		return {
			currentUser: firebase.auth().currentUser
		}
	},
	methods: {
		goHome: function() {
			this.$router.push("home");
		},
		goLogin: function() {
			this.$router.push("login");
		},
		goSignup: function() {
			this.$router.push("signup");
		},
		signOut: function() {
			let router = this.$router;
			console.log("Signing out...");
			this.currentUser = null;
			firebase.auth().signOut().then(function() {
				router.push("home");
			});
		}
	}
}
</script>

<style scoped>
#nav {
	height: 50px;
	width: 100%;
	padding: 5px;
	display: flex;
	flex-direction: row;
	background-color: #2c2f34;
	align-items: center;
	justify-content: space-around;
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
	margin-right: 5px;
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
	width: 75px;
	text-align: center;
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
	font-size: 3em;
	color: white;
	cursor: pointer;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	vertical-align: center;
}

@media (max-width: 360px) {
	.banner {
		font-size: 2em;
	}

	.nav-item {
		font-size: 0.75em;
		width: 50px;
	}
}
</style>
