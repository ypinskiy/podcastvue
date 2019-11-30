import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';
import router from './router';

import '@/assets/css/tailwind.css';

import App from './App.vue';

Vue.use( VueCompositionApi );

Vue.config.productionTip = false;

new Vue( {
	router,
	render: h => h( App ),
} ).$mount( '#app' );
