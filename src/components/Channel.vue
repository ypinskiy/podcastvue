<template>
<div class="text-base">
	<div v-if="!loading" class="mx-auto flex flex-col justify-between text-center border border-solid border-gray-500 mb-8 p-2 rounded-lg bg-white shadow-lg channel-info">
		<img class="channel-hero" :src="podcastInfo.channel.image" />
		<span class="text-xl font-bold channel-title">{{podcastInfo.channel.title}}</span>
		<span class="mb-4 channel-desc">{{podcastInfo.channel.description}}</span>
		<a class="text-blue-500 hover:underline mb-2 text-sm channel-link" :href="podcastInfo.channel.link">{{podcastInfo.channel.link}}</a>
		<a class="text-blue-500 hover:underline mb-2 text-sm channel-email" :href="`mailto:${podcastInfo.channel.email}`">{{podcastInfo.channel.email}}</a>
		<span class="text-sm text-gray-500 channel-copyright">&copy; {{podcastInfo.channel.copyright}}</span>
	</div>
	<div v-if="!loading" class="flex flex-row flex-wrap justify-between episode-container">
		<div v-for="episode in podcastInfo.episodes" :id="`episode-${episode.guid}`" :key="episode.guid" class="flex flex-col justify-between text-center border border-solid border-gray-500 mb-8 p-2 rounded-lg bg-white shadow-lg episode">
			<img class="episode-image" :src="episode.cover ? episode.cover : podcastInfo.channel.image" />
			<a class="text-blue-500 hover:underline text-xl font-bold episode-title" v-html="episode.title" :href="episode.link"></a>
			<span class="text-sm episode-date">{{episode.date}}</span>
			<span class="mb-1 text-sm episode-dur">{{ConvertDuration(episode.duration)}}</span>
			<span class="pt-2 pb-2 mb-2 border-t border-b border-gray-500 episode-desc" v-html="episode.description"></span>
			<button class="shadow-md rounded-lg p-2 my-0 mx-auto text-white bg-blue-500 hover:bg-blue-700 episode-listen-btn" @click.prevent="ListenToEpisode(episode)">Listen To Episode</button>
		</div>
	</div>
	<audio id="audio-bar" class="fixed bottom-0 w-full h-16 left-0" v-if="playing" controls autoplay :src="currentlyPlaying">Your browser does not support the <code>audio</code> element.</audio>
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
		let currentlyPlayingID = ref( null );
		const ConvertDuration = ( duration ) => {
			if ( duration.includes( ":" ) ) {
				return duration;
			} else {
				return ( parseInt( duration ) / 60 )
					.toFixed( 0 ) + " minutes";
			}
		};
		const ListenToEpisode = ( episode ) => {
			console.log( episode );
			if ( currentlyPlayingID.value != null ) {
				document.getElementById( `episode-${currentlyPlayingID.value}` )
					.classList.remove( "bg-green-300" );
				document.getElementById( `episode-${currentlyPlayingID.value}` )
					.classList.add( "bg-white" );
			}
			playing.value = true;
			currentlyPlaying.value = episode.media.url;
			currentlyPlayingID.value = episode.guid;
			context.root.$nextTick( function () {
				document.getElementById( `episode-${currentlyPlayingID.value}` )
					.classList.add( "bg-green-300" );
				document.getElementById( `episode-${currentlyPlayingID.value}` )
					.classList.remove( "bg-white" );
			} );
			history.replaceState( {}, "", `?channel=${encodeURI(context.attrs.channel)}&playing=${currentlyPlayingID.value}` );
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
			console.log( context.root.$route.query.playing );
			context.root.$nextTick( function () {
				if ( context.root.$route.query.playing ) {
					for ( let i = 0; i < json.episodes.length; i++ ) {
						if ( context.root.$route.query.playing == json.episodes[ i ].guid ) {
							ListenToEpisode( json.episodes[ i ] );
							break;
						}
					}
				}
			} );
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
.episode {
	width: 350px;
}

.channel-info {
	width: 600px;
}
</style>
