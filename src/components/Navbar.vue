<template>
<div id="nav" v-if="currentUser">
	<div class="nav-email nav-item">{{ currentUser.email }}</div>
	<button class="nav-item">Sign Out</button>
	<div class="banner" @click='goHome'>Podcast Vue</div>
</div>
<div id="nav" v-else>
	<div class="nav-item" @click='goLogin'>Login</div>
	<div class="nav-item" @click='goSignup'>Sign Up</div>
	<div class="banner" @click='goHome'>Podcast Vue</div>
</div>
</template>

<script>
import firebase from '@/firebaseConfig.js'

export default {
	name: 'Navbar',
	data: function() {
		return {
			currentUser: firebase.auth.currentUser
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
			firebase.auth.signOut().then(function() {
				this.$router.push("home");
			});
		}
	}
}
</script>

<style scoped>
#nav {
	height: 50px;
	width: 100vw;
	padding: 5px;
	display: flex;
	flex-direction: row;
	background-color: #2c2f34;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
}

.nav-item {
	height: 25px;
	display: inline-block;
	padding: 5px;
	border: 1px solid white;
	border-radius: 5px;
	box-sizing: content-box;
	vertical-align: middle;
	line-height: 25px;
	text-decoration: unset;
	color: white;
	cursor: pointer;
}

.nav-item:not(:last-child) {
	margin-right: 10px;
}

.banner {
	font-size: 3em;
	color: white;
	margin-left: 10px;
	cursor: pointer;
}
</style>
