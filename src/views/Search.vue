<template>
<div id="search">
	<div v-if="loading" class="loading">
		Loading...
	</div>
	<div v-if="searchInfo" class="search-body">
		<table class="search-results-table">
			<thead>
				<tr>
					<th>Thumbnail</th>
					<th>Podcast Name</th>
					<th>Podcast Artist</th>
					<th>Genre</th>
					<th># Of Episodes</th>
					<th>Last Episode</th>
				</tr>
			</thead>
			<tbody>
				<tr class="result" v-for="result in searchInfo" :key="result.artistId" @click="goToChannel(result.feedUrl)">
					<td><img class="pod-img" :src="result.artworkUrl600"></td>
					<td class="pod-title">{{ result.collectionName }}</td>
					<td class="pod-artist">{{ result.artistName }}</td>
					<td class="pod-genre">{{result.primaryGenreName}}</td>
					<td class="pod-ep-count">{{ result.trackCount }}</td>
					<td class="pod-last-ep-date">{{ result.releaseDate }}</td>
				</tr>
			</tbody>
		</table>
	</div>
	<div v-if="globalError" class="error">
		{{ globalError }}
	</div>
</div>
</template>

<script>
export default {
	name: 'Search',
	props: ["query"],
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
		goToChannel: function(channel) {
			this.$router.push({
				path: 'channel',
				query: {
					channel: channel
				}
			})
		},
		searchITunes: function() {
			let data = this.$data;
			data.loading = true;
			fetch(`https://itunes.apple.com/search?entity=podcast&media=podcast&term=${encodeURI(this.query)}`)
			.then(res => res.json())
			.then(function(response) {
				data.loading = false;
				if (response.results.length > 0) {
					data.searchInfo = response.results;
				} else {
					data.globalError = "No search results for that term."
					data.searchInfo = null;
				}
			})
			.catch(function(error) {
				data.globalError = error;
				data.searchInfo = null;
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
	margin-left: 10vw;
}

.search-results-table {
	width: 100%;
	background: #fff;
	margin: 1em 0;
	border: 1px solid rgba(34, 36, 38, .15);
	-webkit-box-shadow: none;
	box-shadow: none;
	border-radius: .28571429rem;
	color: rgba(0, 0, 0, .87);
	border-collapse: separate;
	border-spacing: 0;
	table-layout: fixed;
}

.search-results-table thead th {
	cursor: auto;
	background: #f9fafb;
	text-align: inherit;
	color: rgba(0, 0, 0, .87);
	padding: .92857143em .78571429em;
	vertical-align: inherit;
	font-style: none;
	font-weight: 700;
	text-transform: none;
	border-bottom: 1px solid rgba(34, 36, 38, .1);
	border-left: none;
	text-align: center;
}

.result {
	text-align: center;
	cursor: pointer;
}

.result:hover {
	background: rgba(0, 0, 0, .05) !important;
	color: rgba(0, 0, 0, .95) !important;
}

.result td {
	padding: 5px;
	transition: background .1s ease, color .1s ease;
}

.result .pod-img {
	height: 60px;
	width: 60px;
	object-fit: contain;
}

.result .pod-title {
	font-weight: bold;
	text-decoration: underline;
}

.error {
	text-align: center;
	vertical-align: middle;
	font-size: 5rem;
	margin: 10%;
	color: red;
	font-weight: bold;
}

@media (max-width: 360px) {
	.search-body {
		width: 100vw;
		margin: 0;
	}
	thead, tr, tbody, td, th {
		display: block !important;
	}
	tbody tr:not(:last-child) {
		border-bottom: 1px solid rgba(34, 36, 38, .1);
	}
	.search-results-table {
		margin: 0;
		border-radius: 0px;
		border: none;
	}
	.search-results-table thead th {
		padding: 5px;
		background: #f9fafb;
	}
	.result .pod-img {
		height: 120px;
		width: 120px;
	}
	.loading {
		font-size: 1.5rem;
	}
	.error {
		font-size: 1.5rem;
	}
}
</style>
