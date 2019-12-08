import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';
import router from './router';
import { store } from './store.js';
const Firebase = require( './firebaseConfig.js' );
let app;

import '@/assets/css/tailwind.css';

import App from './App.vue';

Vue.use( VueCompositionApi );

Vue.config.productionTip = false;

Firebase.auth.onAuthStateChanged( user => {
	if ( !app ) {
		app = new Vue( {
			router,
			store,
			render: h => h( App ),
		} );
		app.$mount( '#app' );
	}
} );
