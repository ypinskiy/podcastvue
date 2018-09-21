const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const compression = require( 'compression' );
const axios = require( "axios" );
const helmet = require( 'helmet' );

const port = process.env.PORT || 8080;
let app = express();
let server = require( 'http' ).createServer( app );
server.listen( port );
app.set( 'json spaces', 0 );
app.use( helmet() );
app.use( compression() );
app.use( bodyParser.json() );
app.use( bodyParser.text() );
app.use( bodyParser.urlencoded( {
	extended: true
} ) );

app.use( function ( req, res, next ) {
	res.header( "Access-Control-Allow-Origin", "*" );
	res.header( "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept" );
	next();
} );

app.post( '/convertPodcastURL', function ( req, res ) {
	console.log("Recieved request to convert podcast feed url...");
	let podcastURL = req.body;
	axios.get( podcastURL )
		.then( function ( response ) {
			console.log( `Converting podcast URL "${podcastURL}" to podcast json...` );
			try {
				res.json( BuildPodcastJson( response.data ) );
			} catch ( err ) {
				console.log( err );
			}
		} )
		.catch( function ( error ) {
			console.log( error );
		} );
} )

function BuildPodcastJson( xmlText ) {
	let podcast = {};
	podcast.channel = {};
	let titleSplitter = /<title>([\s\S]*?)<\/title>/gim;
	if ( titleSplitter.test( xmlText ) ) {
		titleSplitter.lastIndex = 0;
		podcast.channel.title = titleSplitter.exec( xmlText )[ 1 ];
	} else {
		podcast.channel.title = /<itunes:title>([\s\S]*?)<\/itunes:title>/gim.exec( xmlText )[ 1 ];
	}
	podcast.channel.description = /<description>([\s\S]*?)<\/description>/gim.exec( xmlText )[ 1 ];
	podcast.channel.email = /<itunes:email>([\s\S]*?)<\/itunes:email>/gim.exec( xmlText )[ 1 ];
	podcast.channel.copyright = /<copyright>([\s\S]*?)<\/copyright>/gim.exec( xmlText )[ 1 ];
	podcast.channel.link = /<link>([\s\S]*?)<\/link>/gim.exec( xmlText )[ 1 ];
	podcast.channel.image = /<url>([\s\S]*?)<\/url>/gim.exec( xmlText )[ 1 ];
	podcast.episodes = [];
	let itemSplitter = /<item>([\s\S]*?)<\/item>/gim;
	let rawItemArray = null;
	let rawItems = [];
	while ( ( rawItemArray = itemSplitter.exec( xmlText ) ) !== null ) {
		rawItems.push( rawItemArray[ 1 ] );
	}
	rawItems.forEach( function ( item ) {
		let podcastItem = {};
		podcastItem.title = /<title>([\s\S]*?)<\/title>/gim.exec( item )[ 1 ];
		if ( /<description>([\s\S]*?)<\/description>/gim.test( item ) ) {
			podcastItem.description = /<description>([\s\S]*?)<\/description>/gim.exec( item )[ 1 ];
		} else {
			podcastItem.description = /<itunes:summary>([\s\S]*?)<\/itunes:summary>/gim.exec( item )[ 1 ];
		}
		if ( /CDATA/gim.test( podcastItem.description ) ) {
			podcastItem.description = podcastItem.description.trim();
			podcastItem.description = podcastItem.description.slice( 9, podcastItem.description.length - 3 );
		}
		podcastItem.link = /<link>([\s\S]*?)<\/link>/gim.exec( item )[ 1 ];
		podcastItem.date = /<pubDate>([\s\S]*?)<\/pubDate>/gim.exec( item )[ 1 ];
		let durationXMLNSSplitter = /<itunes:duration xmlns:itunes="http:\/\/www.itunes.com\/dtds\/podcast-1.0.dtd">([\s\S]*?)<\/itunes:duration>/gim;
		if ( durationXMLNSSplitter.test( item ) ) {
			durationXMLNSSplitter.lastIndex = 0;
			let splitDuration = durationXMLNSSplitter.exec( item );
			podcastItem.duration = splitDuration[ 1 ];
		} else {
			podcastItem.duration = /<itunes:duration>([\s\S]*?)<\/itunes:duration>/gim.exec( item )[ 1 ];
		}
		podcastItem.cover = /<itunes:image href="([\s\S]*?)" \/>/gim.exec( item )[ 1 ];
		podcastItem.guid = /<guid isPermalink="false">([\s\S]*?)<\/guid>/gim.exec( item )[ 1 ];
		podcastItem.media = {};
		let mediaSplit = [];
		let mediaNoSpaceSplitter = /<enclosure url="([\s\S]*?)" length="([\s\S]*?)" type="([\s\S]*?)"\/>/gim;
		if ( mediaNoSpaceSplitter.test( item ) ) {
			mediaNoSpaceSplitter.lastIndex = 0;
			mediaSplit = mediaNoSpaceSplitter.exec( item );
		} else {
			mediaSplit = /<enclosure url="([\s\S]*?)" length="([\s\S]*?)" type="([\s\S]*?)" \/>/gim.exec( item );
		}
		podcastItem.media.url = mediaSplit[ 1 ];
		podcastItem.media.size = mediaSplit[ 2 ];
		podcastItem.media.type = mediaSplit[ 3 ];
		podcast.episodes.push( podcastItem );
	} );
	return podcast;
}

console.log( "Starting podcast viewer server..." );
