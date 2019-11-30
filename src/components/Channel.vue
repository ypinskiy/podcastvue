<template>
<div class="text-base">
	<div v-if="!loading" class="container mx-auto w-3/6 flex flex-col justify-between text-center border border-solid border-gray-500 mb-8 p-2 rounded-lg bg-white shadow-lg channel-info">
		<img class="channel-hero" :src="podcastInfo.channel.image" />
		<span class="text-xl font-bold channel-title">{{podcastInfo.channel.title}}</span>
		<span class="mb-4 channel-desc">{{podcastInfo.channel.description}}</span>
		<a class="text-blue-500 hover:underline mb-2 text-sm channel-link" :href="podcastInfo.channel.link">{{podcastInfo.channel.link}}</a>
		<a class="text-blue-500 hover:underline mb-2 text-sm channel-email" :href="`mailto:${podcastInfo.channel.email}`">{{podcastInfo.channel.email}}</a>
		<span class="text-sm text-gray-500 channel-copyright">&copy; {{podcastInfo.channel.copyright}}</span>
	</div>
	<div v-if="!loading" class="flex flex-row flex-wrap justify-between episode-container">
		<div v-for="episode in podcastInfo.episodes" :key="episode.guid" class="flex flex-col justify-between text-center border border-solid border-gray-500 mb-8 p-2 rounded-lg bg-white shadow-lg w-64 episode">
			<img class="episode-image" :src="episode.cover ? episode.cover : podcastInfo.channel.image" />
			<a class="text-blue-500 hover:underline text-xl font-bold episode-title" v-html="episode.title" :href="episode.link"></a>
			<span class="text-sm episode-date">{{episode.date}}</span>
			<span class="mb-2 text-sm episode-dur">{{ConvertDuration(episode.duration)}}</span>
			<span class="mb-4 episode-desc" v-html="episode.description"></span>
			<button class="shadow-md rounded-lg p-2 my-0 mx-auto text-white bg-blue-500 hover:bg-blue-700 episode-listen-btn" @click.prevent="ListenToEpisode(episode.media.url)">Listen To Episode</button>
		</div>
	</div>
	<audio class="fixed bottom-0 w-full h-16 left-0" v-if="playing" controls autoplay :src="currentlyPlaying">Your browser does not support the <code>audio</code> element.</audio>
	<img v-if="loading" class="mx-auto loading" src="https://media.giphy.com/media/sxJ1nCeUoNSfe/giphy.gif" />
</div>
</template>

<script>
import { ref, onMounted } from "@vue/composition-api";
export default {
	setup( props, context ) {
		console.log( context.attrs.channel );
		let podcastInfo = ref( {} );
		let loading = ref( true );
		let playing = ref( false );
		let currentlyPlaying = ref( "" );
		const ConvertDuration = ( duration ) => {
			if ( duration.includes( ":" ) ) {
				return duration;
			} else {
				return ( parseInt( duration ) / 60 )
					.toFixed( 0 ) + " minutes";
			}
		};
		const ListenToEpisode = ( mediaURL ) => {
			console.log( mediaURL );
			playing.value = true;
			currentlyPlaying.value = mediaURL;
		};
		onMounted( async () => {
			let response = await fetch( window.location.protocol + "//" + window.location.hostname + ":5050/convertPodcastURL", {
				method: "POST",
				mode: "cors",
				cache: "no-cache",
				headers: {
					"Content-Type": "text/plain",
				},
				referrer: "no-referrer",
				body: context.attrs.channel
			} );
			let json = await response.json();
			console.log( json );
			podcastInfo.value = json;
			loading.value = false;
		} );
		return {
			podcastInfo,
			loading,
			playing,
			currentlyPlaying,
			ConvertDuration,
			ListenToEpisode
		};
	}
}
</script>

<style>

</style>
