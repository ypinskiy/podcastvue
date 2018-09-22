<template>
<div id="channel">
	<div class="loading" v-if="loading">
		Loading...
	</div>
	<div v-if="podcast" class="channel">
		<div class="channel-info">
			<img id="podcast-img" :src="podcast.channel.image">
			<span id="podcast-title">{{ podcast.channel.title }}</span>
			<span id="podcast-desc">{{ podcast.channel.description }}</span>
			<div class="info-box">
				<a id="podcast-email" :href="podcast.channel.email" class="info">{{ podcast.channel.email }}</a>
				<a id="podcast-link" :href="podcast.channel.link" class="info">{{ podcast.channel.link }}</a>
				<span id="podcast-copyright" class="info">Copyright: {{ podcast.channel.copyright }}</span>
				<span id="podcast-episode-num" class="info">{{ podcast.episodes.length }} episodes</span>
			</div>
		</div>
		<div id="episode-container">
			<div v-for="(episode, index) in podcast.episodes" :key="episode.guid" class="episode">
				<div class="ep-hero">
					<img class="ep-cover" :src="episode.cover">
					<div class="ep-desc" v-html="episode.description"></div>
				</div>
				<div class="ep-header">
					<div class="ep-title">{{ episode.title }}</div>
					<div class="ep-date">{{ episode.date }}</div>
				</div>
				<div class="amplitude-play-pause amplitude-paused" :amplitude-song-index="index" @click="displayProgress"></div>
				<div class="progress-bar-container tech-hidden" @click="setProgress">
					<progress class="amplitude-song-played-progress" :amplitude-song-index="index"></progress>
					<progress class="amplitude-buffered-progress" :amplitude-song-index="index"></progress>
				</div>
				<div class="time-container tech-hidden">
					<div class="current-time-container">
						<span class="amplitude-current-hours" :amplitude-song-index="index"></span>
						<span class="amplitude-current-minutes" :amplitude-song-index="index"></span>
						<span class="amplitude-current-seconds" :amplitude-song-index="index"></span>
					</div>
					<div class="duration-time-container">
						<span class="amplitude-duration-hours" :amplitude-song-index="index"></span>
						<span class="amplitude-duration-minutes" :amplitude-song-index="index"></span>
						<span class="amplitude-duration-seconds" :amplitude-song-index="index"></span>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div v-if="globalError" class="error">
		{{ globalError }}
	</div>
</div>
</template>

<script>
import * as Amplitude from 'amplitudejs'
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
	mounted: function() {
		this.fetchData();
	},
	watch: {
		'$route': 'fetchData',
		podcast: function (val, oldVal) {
			console.log("Vue saw that podcast changed.", val, oldVal);
			if (this.podcast != null && this.globalError == null && this.loading == false) {
				this.InitAmplitude(this.podcast);
			}
		}
	},
	methods: {
		InitAmplitude: function(podcastJson) {
			let playlist = {
				songs: [],
				default_album_art: podcastJson.channel.image
			};
			podcastJson.episodes.forEach(function(episode) {
				let playlistEntry = {};
				playlistEntry.name = episode.title;
				playlistEntry.artist = podcastJson.channel.title;
				playlistEntry.url = episode.media.url;
				playlistEntry.cover_art_url = episode.cover;
				playlist.songs.push(playlistEntry);
			});
			Amplitude.init(playlist);
		},
		setProgress: function(event) {
			let offset = event.target.getBoundingClientRect();
			let x = event.pageX - offset.left;
			Amplitude.setSongPlayedPercentage((parseFloat(x) / parseFloat(event.target.offsetWidth)) * 100);
		},
		displayProgress: function(event) {
			let progressBars = document.getElementsByClassName("progress-bar-container");
			for (let i = 0; i < progressBars.length; i++) {
				progressBars[i].classList.add("tech-hidden");
			}
			let timeContainers = document.getElementsByClassName("time-container");
			for (let i = 0; i < timeContainers.length; i++) {
				timeContainers[i].classList.add("tech-hidden");
			}
			let volumeSliders = document.getElementsByClassName("volume-container");
			for (let i = 0; i < volumeSliders.length; i++) {
				volumeSliders[i].classList.add("tech-hidden");
			}
			event.target.parentNode.getElementsByClassName("time-container")[0].classList.remove("tech-hidden");
			event.target.parentNode.getElementsByClassName("progress-bar-container")[0].classList.remove("tech-hidden");
		},
		fetchData: function() {
			let InitAmplitude = this.InitAmplitude;
			let data = this.$data;
			let nextTick = this.$nextTick;
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
					nextTick(function () {
						console.log("Vue ticked after fetch finished");
						InitAmplitude(data.podcast);
					});
					console.log(data.podcast);
				})
				.catch(function(error) {
					data.podcast = null;
					data.loading = false;
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
	width: 100%;
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

a.info:visited,
a.info:active,
a.info:link {
	color: grey;
	text-decoration: underline;
}

#episode-container {
	box-sizing: border-box;
	padding: 10px;
	display: grid;
	width: 100%;
	grid-gap: 15px;
	grid-template-columns: repeat(auto-fill, 350px);
	grid-auto-rows: max-content;
	justify-content: space-between;
	background-color: lightgray;
}

.episode {
	width: 350px;
	border-radius: 5px;
	border: 1px solid black;
	background-color: white;
}

.ep-hero {
	position: relative;
	height: 350px;
	width: 350px;
}

.ep-hero:hover .ep-cover {
	opacity: 0.3;
	filter: blur(4px);
}

.ep-hero:hover .ep-desc {
	opacity: 1;
}

.ep-cover {
	transition: opacity 0.5s ease;
	border-radius: 5px;
	height: 350px;
	width: 350px;
	object-fit: cover;
	position: absolute;
}

.ep-desc {
	opacity: 0;
	transition: opacity 0.5s ease;
	position: absolute;
	height: 350px;
	width: 350px;
	padding: 10px;
	overflow: hidden;
	z-index: 5;
	box-sizing: border-box;
}

.ep-header {
	display: flex;
	flex-direction: column;
	align-content: center;
	justify-content: center;
	text-align: center;
	padding: 5px;
}

.ep-title {
	font-weight: bold;
	font-size: 1.5rem;
}

.episode .amplitude-play-pause {
	margin-left: calc((350px / 2) - 30px);
	background-color: black;
	height: 60px;
	width: 60px;
	cursor: pointer;
}

.episode .amplitude-play-pause.amplitude-paused {
	-webkit-mask-image: url("/svg/play.svg");
	mask-image: url("/svg/play.svg");
}

.episode .amplitude-play-pause.amplitude-playing {
	-webkit-mask-image: url("/svg/pause.svg");
	mask-image: url("/svg/pause.svg");
}

div.progress-bar-container {
	width: calc(100% - 11px);
	height: 4px;
	background-color: #000;
	position: relative;
	border: 1px solid black;
	border-radius: 5px;
	margin: 5px;
}

div.progress-bar-container progress.amplitude-song-played-progress {
	width: 100%;
	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;
	height: 4px;
	display: block;
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
	z-index: 9;
	border: none;
	cursor: pointer;
	background: transparent;
	border-radius: 5px 0px 0px 5px;
}

.progress-bar-container progress.amplitude-song-played-progress[value]::-webkit-progress-bar {
	background: none;
}

.progress-bar-container progress.amplitude-song-played-progress[value]::-webkit-progress-value {
	background: white;
}

.progress-bar-container progress.amplitude-song-played-progress[value]::-moz-progress-bar {
	background: white;
}

.progress-bar-container progress.amplitude-buffered-progress {
	width: 100%;
	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;
	height: 4px;
	display: block;
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
	z-index: 2;
	border: none;
	background: transparent;
	border-radius: 5px 0px 0px 5px;
}

.tech-hidden {
	opacity: 0 !important;
	user-select: none !important;
	pointer-events: none !important;
}

.progress-bar-container progress.amplitude-buffered-progress[value]::-webkit-progress-bar {
	background: none;
}

.player-progress-bar-container progress.amplitude-buffered-progress[value]::-webkit-progress-value {
	background-color: rgba(255, 255, 255, 0.5);
	transition: width 0.1s ease;
}

.player-progress-bar-container progress.amplitude-buffered-progress[value]::-moz-progress-bar {
	background: rgba(255, 255, 255, 0.5);
}

span.amplitude-current-hours:after,
span.amplitude-current-minutes:after,
span.amplitude-duration-hours:after,
span.amplitude-duration-minutes:after {
	content: ":";
}

.time-container {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding-left: 5px;
	padding-right: 5px;
	margin-bottom: 5px;
}

@media (max-width: 360px) {
	.channel-info {
		height: 82vh;
	}

	#podcast-title {
		font-size: 1.5rem;
	}

	#podcast-desc {
		font-size: 1rem;
	}

	.info-box {
		font-size: 0.75rem;
	}

	.loading {
		font-size: 2rem;
	}

	#episode-container {
		grid-template-columns: 1fr;
		justify-content: center;
		align-content: center;
	}
}
</style>
