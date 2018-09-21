import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'

import Home from './views/Home.vue'
import Search from './views/Search.vue'
import Channel from './views/Channel.vue'

Vue.use( Router )

let router = new Router( {
	mode: 'history',
	routes: [
		{
			path: '/',
			name: 'home',
			component: Home
		},
		// {
		// 	path: '/login',
		// 	name: 'login',
		// 	component: Login
		// },
		// {
		// 	path: '/signup',
		// 	name: 'signup',
		// 	component: Signup
		// },
		{
			path: '/search',
			name: 'search',
			component: Search,
			props: (route) => ({ query: route.query.q })
		},
		{
			path: '/channel',
			name: 'channel',
			component: Channel,
			props: (route) => ({ channel: route.query.channel })
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
} )

export default router
