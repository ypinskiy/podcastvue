<template>
<div class="text-base search-container">
	<form @submit.prevent="searchPodcasts" class="mb-6 search-form">
		<label>Search for a podcast here:</label>
		<input type="text" v-model="searchTerms" placeholder="Search for a podcast here..." class="w-64 ml-6 rounded-lg focus:rounded-lg border-gray-500 p-2 bg-gray-200 focus:bg-white search-input" />
	</form>
	<img v-if="loading" class="mx-auto loading" src="https://media.giphy.com/media/sxJ1nCeUoNSfe/giphy.gif" />
	<div v-if="!loading" class="flex flex-row flex-wrap justify-between results">
		<div v-for="result in results" :key="result.collectionId" class="flex flex-col justify-between text-center border border-solid border-gray-500 mb-8 p-2 rounded-lg bg-white shadow-lg w-64 result">
			<img class="result-img" :src="result.artworkUrl600" />
			<span class="text-xl font-bold result-title">{{result.trackName}}</span>
			<span class="result-artist">{{result.artistName}}</span>
			<div class="mb-2 flex flex-row flex-wrap justify-around genres">
				<span class="text-sm text-gray-500 genre" v-for="genre in result.genres" :key="genre">{{genre}}</span>
			</div>
			<button class="shadow-md rounded-lg p-2 my-0 mx-auto text-white bg-blue-500 hover:bg-blue-700 channel-btn" @click.prevent="switchToChannel(result.feedUrl)">View Episodes</button>
		</div>
	</div>
	<div class="no-result" v-if="noResults && !loading">
		<h1 class="no-result-title">No Results Found.</h1>
	</div>
</div>
</template>

<script>
import { ref } from '@vue/composition-api';
const API_URL = 'https://itunes.apple.com/search?entity=podcast&media=podcast&term=';
export default {
	setup( props, context ) {
		let searchTerms = ref( '' );
		let loading = ref( false );
		let noResults = ref( false );
		let results = ref( [] );
		const searchPodcasts = async () => {
			loading.value = true;
			let response = await fetch( API_URL + encodeURI( searchTerms.value ) );
			let json = await response.json();
			results.value = json.results;
			console.log( json.results );
			if ( json.results.length === 0 ) {
				noResults.value = true;
			} else {
				noResults.value = false;
			}
			setTimeout( () => {
				loading.value = false;
			}, 1000 );
		};
		const switchToChannel = ( channel ) => {
			context.root.$router.push( {
				path: 'channel',
				query: {
					channel: channel
				}
			} )
		};
		return {
			searchTerms,
			loading,
			noResults,
			results,
			searchPodcasts,
			switchToChannel
		};
	}
};
</script>

<style>

</style>
