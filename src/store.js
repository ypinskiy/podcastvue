import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'

Vue.use( Vuex )

export default new Vuex.Store( {
	state: {
		user: null
	},
	getters: {
		getUser: state => {
			return state.user;
		}
	},
	mutations: {
		setUserFromFirebaseMut: state => {
			state.user = firebase.auth().currentUser;
		}
	},
	actions: {
		setUserFromFirebaseAction: context => {
			context.commit( 'setUserFromFirebaseMut' );
		}
	}
} )
