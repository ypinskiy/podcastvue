<template>
<div @click="viewChannel" class="result">
	<img class="pod-img" :src="result.artworkUrl600">
	<div class="pod-name">{{ result.collectionName }} by {{ result.artistName }}</div>
	<div class="pod-genre">Genre: {{ result.primaryGenreName }}</div>
	<div class="pod-eps">{{ result.trackCount }} episodes, most recently at {{ result.releaseDate }}</div>
</div>
</template>

<script>

export default {
	name: 'SearchResult',
	props: ["result"],
	methods: {
		viewChannel: function () {
			this.$router.push({
				path: 'channel',
				query: {
					channel: this.result.feedUrl
				}
			})
		}
	}
}
</script>

<style scoped>
	.result {
		display: flex;
		flex-direction: row;
		height: 60px;
		width: 100%;
		border-radius: 5px;
		border: 1px solid black;
		justify-content: space-between;
		align-items: center;
		padding: 5px;
		cursor: pointer;
	}

	.result > .pod-name {
		font-weight: bold;
	}

	.result > .pod-img {
		height: 50px;
		width: 50px;
		object-fit: contain;
	}
</style>
