import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

import Home from './views/Home.vue'
import Search from './views/Search.vue'
import Channel from './views/Channel.vue'
import Login from './views/Login.vue'

Vue.use( Router )

let router = new Router( {
	mode: 'history',
	routes: [
		{
			path: '/',
			name: 'home',
			component: Home
		},
		{
			path: '/login',
			name: 'login',
			component: Login
		},
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
	const currentUser = store.getters.getUser;

	if ( requiresAuth && !currentUser ) {
		next( '/login' )
	} else if ( requiresAuth && currentUser ) {
		next()
	} else {
		next()
	}
} )

export default router
