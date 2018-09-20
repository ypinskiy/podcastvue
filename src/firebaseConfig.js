import firebase from 'firebase'
import 'firebase/firestore'

const config = {
	apiKey: "AIzaSyABig3e-vwIBWDjCYRtSZ2dvnTO59MqbZk",
	authDomain: "podcastvue.firebaseapp.com",
	databaseURL: "https://podcastvue.firebaseio.com",
	projectId: "podcastvue",
	storageBucket: "podcastvue.appspot.com",
	messagingSenderId: "423284312623"
};
firebase.initializeApp( config )

const db = firebase.firestore()
const auth = firebase.auth()
const currentUser = auth.currentUser

const settings = {
	timestampsInSnapshots: true
}
db.settings( settings )

export default {
	db,
	auth,
	currentUser
}
