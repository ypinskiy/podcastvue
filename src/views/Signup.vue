<template>
<div class="signup-page">
	<h3>Sign up for your PodcastVue account!</h3>
	<input id="email" v-model="email" type="email" required placeholder="Email address">
	<input id="pass" v-model="pass" type="password" required placeholder="Password">
	<button class="email-login-btn" @click="emailSignup">Sign up with an email</button>
	<div class="divider">OR</div>
	<button class="google-login-btn" @click="googleSignup">Sign up with Google</button>
</div>
</template>

<script>
import firebase from 'firebase'
export default {
	name: 'Signup',
	data: function() {
		return {
			email: '',
			pass: ''
		}
	},
	methods: {
		emailSignup: function() {
			let router = this.$router;
			firebase.auth().createUserWithEmailAndPassword(this.email, this.pass).then(
				function(user) {
					console.log(`User created: ${user}`);
					firebase.auth().currentUser = user;
					router.push({
						path: 'home'
					});
				},
				function(error) {
					console.log(`Error creating user.`, error)
				}
			);
		},
		googleSignup: function() {
			let router = this.$router;
			let provider = new firebase.auth.GoogleAuthProvider();
			provider.addScope('profile');
			provider.addScope('email');
			firebase.auth().signInWithPopup(provider).then(function(result) {
				// This gives you a Google Access Token.
				let token = result.credential.accessToken;
				// The signed-in user info.
				let user = result.user;
				console.log(`Created user with Google.`, user, token);
				router.push({
					path: 'home'
				});
			});
		}
	}
}
</script>

<style>
.signup-page {
	text-align: center;
	width: 60vw;
	margin-left: 20vw;
	height: calc(100% - 60px);
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	font-size: larger;
	font-family: Lato, 'Helvetica Neue', Arial, Helvetica, sans-serif;
}

.signup-page>input {
	margin: 0;
	max-width: 100%;
	-webkit-box-flex: 1;
	-ms-flex: 1 0 auto;
	flex: 1 0 auto;
	outline: 0;
	-webkit-tap-highlight-color: rgba(255, 255, 255, 0);
	text-align: left;
	line-height: 1.21428571em;
	font-family: Lato, 'Helvetica Neue', Arial, Helvetica, sans-serif;
	padding: .67857143em 1em;
	background: #fff;
	border: 1px solid rgba(34, 36, 38, .15);
	color: rgba(0, 0, 0, .87);
	border-radius: .28571429rem;
	-webkit-transition: border-color .1s ease, -webkit-box-shadow .1s ease;
	transition: border-color .1s ease, -webkit-box-shadow .1s ease;
	transition: box-shadow .1s ease, border-color .1s ease;
	transition: box-shadow .1s ease, border-color .1s ease, -webkit-box-shadow .1s ease;
	-webkit-box-shadow: none;
	box-shadow: none;
	margin-bottom: 10px;
}

.signup-page>input:focus {
	border-color: #85b7d9;
	background: #fff;
	color: rgba(0, 0, 0, .8);
	-webkit-box-shadow: none;
	box-shadow: none;
}

.signup-page>button {
	border-radius: .28571429rem;
	border: 1px solid rgba(34, 36, 38, .15);
	width: 200px;
	height: 35px;
	text-align: center;
	align-self: center;
	background-color: #2185d0;
	color: white;
	font-weight: bold;
	cursor: pointer;
}

.divider {
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: .05em;
	color: rgba(0, 0, 0, .85);
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	-webkit-tap-highlight-color: transparent;
	font-size: 1rem;
	display: table;
	white-space: nowrap;
	height: auto;
	line-height: 1;
	text-align: center;
	margin-top: 15px;
	margin-bottom: 15px;
}

.divider:after,
.divider:before {
	-webkit-box-sizing: inherit;
	box-sizing: inherit;
	content: '';
	display: table-cell;
	position: relative;
	top: 50%;
	width: 50%;
	background-repeat: no-repeat;
	background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABaAAAAACCAYAAACuTHuKAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1OThBRDY4OUNDMTYxMUU0OUE3NUVGOEJDMzMzMjE2NyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1OThBRDY4QUNDMTYxMUU0OUE3NUVGOEJDMzMzMjE2NyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjU5OEFENjg3Q0MxNjExRTQ5QTc1RUY4QkMzMzMyMTY3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjU5OEFENjg4Q0MxNjExRTQ5QTc1RUY4QkMzMzMyMTY3Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+VU513gAAADVJREFUeNrs0DENACAQBDBIWLGBJQby/mUcJn5sJXQmOQMAAAAAAJqt+2prAAAAAACg2xdgANk6BEVuJgyMAAAAAElFTkSuQmCC);
}

.divider:before {
	background-position: right 1em top 50%;
}

.divider:after {
	background-position: left 1em top 50%;
}

@media (max-width: 360px) {
	.signup-page {
		width: 90vw;
		margin-left: 5vw;
	}
}
</style>
