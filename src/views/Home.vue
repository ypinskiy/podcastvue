<template>
<div class="home">
	<h1>Welcome to Podcast Vue!</h1>
	<h3>This is a web app made with Vue.js. Listen and subscribe to any podcast you want!</h3>
	<input type="text" @keyup.enter="search" placeholder="Search for a podcast...">
	<span>OR</span>
	<input type="text" @keyup.enter="renderFeed" placeholder="Enter a podcast RSS feed URL...">
</div>
</template>

<script>
export default {
	name: 'Home',
	methods: {
		search: function(event) {
			if (event.target.value != "") {
				this.$router.push({
					path: 'search',
					query: {
						q: event.target.value
					}
				});
			}
		},
		renderFeed: function(event) {
			this.$router.push({
				path: 'channel',
				query: {
					channel: event.target.value
				}
			})
		}
	}
}
</script>

<style>
.error {
	border: 3px solid red;
	color: red;
}

.home {
	text-align: center;
	width: 60vw;
	margin-left: 20vw;
	height: calc(100% - 50px);
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	font-size: larger;
}

.home>input {
	border-radius: 5px;
	font-size: 16px;
	padding: 5px;
	border: 1px solid black;
	margin: 10px;
}
</style>
