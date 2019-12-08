import Vue from 'vue';
import Router from 'vue-router';
import firebase from 'firebase';

import Home from './components/Home.vue';
import Login from './components/Login.vue';
import Subscriptions from './components/Subscriptions.vue';
import Search from './components/Search.vue';
import Channel from './components/Channel.vue';

Vue.use( Router );

let router = new Router( {
	mode: 'history',
	routes: [
		{
			path: '/',
			name: 'home',
			component: Home
		},
		{
			path: '/search',
			name: 'search',
			component: Search
		},
		{
			path: '/channel',
			name: 'channel',
			component: Channel,
			props: ( route ) => ( {
				channel: route.query.channel,
				playing: route.query.playing
			} )
		},
		{
			path: '/login',
			name: 'login',
			component: Login
		},
		{
			path: '/subs',
			name: 'subs',
			component: Subscriptions,
			meta: {
				requiresAuth: true
			}
		},
		{ path: '*', redirect: '/' }
	]
} );

router.beforeEach( ( to, from, next ) => {
	const requiresAuth = to.matched.some( x => x.meta.requiresAuth )
	const currentUser = firebase.auth().currentUser

	if ( requiresAuth && !currentUser ) {
		next( '/login' )
	} else if ( requiresAuth && currentUser ) {
		next()
	} else {
		next()
	}
} );

export default router;
