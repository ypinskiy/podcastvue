<template>
<div id="search">
	<div class="loading" v-if="loading">
		Loading...
	</div>
	<div v-else class="search-body">
		<SearchResult class="search-result" v-for="result in searchInfo"  :result="result" :key="result.artistId"></SearchResult>
	</div>
	<div v-if="globalError" class="error">
		{{ globalError }}
	</div>
</div>
</template>

<script>
import SearchResult from '@/components/SearchResult.vue'

export default {
	name: 'Search',
	props: ["query"],
	components: {
		SearchResult
	},
	data: function() {
		return {
			searchInfo: null,
			loading: false,
			globalError: null
		}
	},
	created: function() {
		this.searchITunes();
	},
	methods: {
		searchITunes: function() {
			let data = this.$data;
			data.loading = true;
			fetch(`https://itunes.apple.com/search?entity=podcast&media=podcast&term=${encodeURI(this.query)}`).then(res => res.json()).then(function(response) {
				data.searchInfo = response.results;
				data.loading = false;
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

.search-body {
	width: 80vw;
	min-height: calc(100vh - 50px);
	margin-left: 10vw;
	display: flex;
	flex-direction: column;
}

.search-result:not(:last-child) {
	margin-bottom: 10px;
}
.search-result:first-child {
	margin-top: 10px;
}

.error {
	text-align: center;
	vertical-align: middle;
	font-size: 5rem;
	margin: 10%;
	color: red;
	font-weight: bold;
}
</style>
