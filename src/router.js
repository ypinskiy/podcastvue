import Vue from 'vue';
import Router from 'vue-router';
import Search from './components/Search.vue';
import Channel from './components/Channel.vue';

Vue.use( Router );

let router = new Router( {
	mode: 'history',
	routes: [
		{
			path: '/',
			name: 'search',
			component: Search
		},
		{
			path: '/channel',
			name: 'channel',
			component: Channel,
			props: ( route ) => ( { channel: route.query.channel } )
		},
		{ path: '*', redirect: '/' }
	]
} );

export default router;
