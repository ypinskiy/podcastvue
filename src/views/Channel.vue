<template>
<div id="channel">
	<div class="loading" v-if="loading">
		Loading...
	</div>
	<div v-else class="channel">
		<div class="channel-info">
			<img id="podcast-img" :src="podcast.channel.image"></img>
			<span id="podcast-title">{{podcast.channel.title}}</span>
			<span id="podcast-desc">{{podcast.channel.description}}</span>
			<div class="info-box">
				<a id="podcast-email" :href="podcast.channel.email" class="info">{{podcast.channel.email}}</a>
				<a id="podcast-link" :href="podcast.channel.link" class="info">{{podcast.channel.link}}</a>
				<span id="podcast-copyright" class="info">Copyright: {{podcast.channel.copyright}}</span>
				<span id="podcast-episode-num" class="info">{{podcast.episodes.length}} episodes</span>
			</div>
		</div>
		<div id="episode-container"></div>
	</div>
	<div v-if="globalError" class="error">
		{{ globalError }}
	</div>
</div>
</template>

<script>
import axios from 'axios'
export default {
	name: 'Channel',
	props: ["channel"],
	data: function() {
		return {
			podcast: null,
			loading: false,
			globalError: null
		}
	},
	created: function() {
		this.fetchData();
	},
	watch: {
		'$route': 'fetchData'
	},
	methods: {
		fetchData: function() {
			let data = this.$data;
			data.globalError = data.podcast = null;
			data.loading = true;
			fetch(window.location.protocol + "//" + window.location.hostname + ":8080/convertPodcastURL", {
					method: "POST",
					mode: "cors",
					cache: "no-cache",
					headers: {
						"Content-Type": "text/plain",
					},
					referrer: "no-referrer",
					body: this.channel
				})
				.then(response => response.json())
				.then(function(response) {
					data.podcast = response;
					data.loading = false;
					console.log(data.podcast);
				})
				.catch(function(error) {
					data.globalError = error;
					console.log(error);
				});
		}
	}
}
</script>

<style>
.loading {
	text-align: center;
	vertical-align: middle;
	font-size: 5rem;
	margin: 10%;
}

.error {
	text-align: center;
	vertical-align: middle;
	font-size: 5rem;
	margin: 10%;
	color: red;
	font-weight: bold;
}

.channel-info {
	background-color: black;
	width: 100vw;
	height: 60vh;
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
	align-content: space-evenly;
}

#podcast-img {
	width: 30vh;
	height: 30vh;
	object-fit: cover;
}

#podcast-title {
	color: white;
	font-size: 2rem;
	text-align: center;
}

#podcast-desc {
	width: 90%;
	color: gray;
	text-align: center;
	font-size: 1.5rem;
}

.info-box {
	width: 90%;
	color: gray;
	text-align: center;
	font-size: 1.2rem;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-evenly;
	align-items: center;
	align-content: space-around;
}

a.info:visited, a.info:active, a.info:link {
	color: grey;
	text-decoration: underline;
}

#episode-container {
	min-height: calc(40vh - 50px);
	display: grid;
	width: 100vw;
	box-sizing: border-box;
	grid-gap: 15px;
	grid-template-columns: repeat(auto-fill, 350px);
	grid-auto-rows: max-content;
	justify-content: space-between;
	background-color: lightgray;
}
</style>
