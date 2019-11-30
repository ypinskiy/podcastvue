const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const compression = require( 'compression' );
const axios = require( "axios" );
const helmet = require( 'helmet' );

const port = process.env.PORT || 5050;
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
	console.log( "Recieved request to convert podcast feed url..." );
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
} );

function StripCDATA( text ) {
	if ( /CDATA/gim.test( text ) ) {
		let newText = text;
		newText = newText.trim();
		newText = newText.slice( 9, newText - 3 );
		return newText;
	} else {
		return text;
	}
}

function BuildPodcastJson( xmlText ) {
	//console.log(xmlText);
	let podcast = {};
	podcast.channel = {};
	let titleSplitter = /<title>([\s\S]*?)<\/title>/gim;
	if ( titleSplitter.test( xmlText ) ) {
		titleSplitter.lastIndex = 0;
		podcast.channel.title = StripCDATA( titleSplitter.exec( xmlText )[ 1 ] );
	} else {
		podcast.channel.title = StripCDATA( /<itunes:title>([\s\S]*?)<\/itunes:title>/gim.exec(
			xmlText
		)[ 1 ] );
	}
	podcast.channel.description = StripCDATA( /<description>([\s\S]*?)<\/description>/gim.exec(
		xmlText
	)[ 1 ] );
	podcast.channel.email = StripCDATA( /<itunes:email>([\s\S]*?)<\/itunes:email>/gim.exec(
		xmlText
	)[ 1 ] );
	podcast.channel.copyright = StripCDATA( /<copyright>([\s\S]*?)<\/copyright>/gim.exec(
		xmlText
	)[ 1 ] );
	podcast.channel.link = StripCDATA( /<link>([\s\S]*?)<\/link>/gim.exec( xmlText )[ 1 ] );
	podcast.channel.image = StripCDATA( /<url>([\s\S]*?)<\/url>/gim.exec( xmlText )[ 1 ] );
	podcast.episodes = [];
	let itemSplitter = /<item>([\s\S]*?)<\/item>/gim;
	let rawItemArray = null;
	let rawItems = [];
	while ( ( rawItemArray = itemSplitter.exec( xmlText ) ) !== null ) {
		rawItems.push( rawItemArray[ 1 ] );
	}
	rawItems.forEach( function ( item ) {
		let podcastItem = {};
		podcastItem.title = StripCDATA( /<title>([\s\S]*?)<\/title>/gim.exec( item )[ 1 ] );
		if ( /<description>([\s\S]*?)<\/description>/gim.test( item ) ) {
			podcastItem.description = StripCDATA( /<description>([\s\S]*?)<\/description>/gim.exec(
				item
			)[ 1 ] );
		} else {
			podcastItem.description = StripCDATA( /<itunes:summary>([\s\S]*?)<\/itunes:summary>/gim.exec(
				item
			)[ 1 ] );
		}
		if ( /<link>([\s\S]*?)<\/link>/gim.test( item ) ) {
			podcastItem.link = StripCDATA( /<link>([\s\S]*?)<\/link>/gim.exec( item )[ 1 ] );
		} else {
			podcastItem.link = StripCDATA( /<enclosure url="([\s\S]*?)"/gim.exec( item )[ 1 ] );
		}
		podcastItem.date = /<pubDate>([\s\S]*?)<\/pubDate>/gim.exec( item )[ 1 ];
		let durationXMLNSSplitter = /<itunes:duration xmlns:itunes="http:\/\/www.itunes.com\/dtds\/podcast-1.0.dtd">([\s\S]*?)<\/itunes:duration>/gim;
		if ( durationXMLNSSplitter.test( item ) ) {
			durationXMLNSSplitter.lastIndex = 0;
			let splitDuration = durationXMLNSSplitter.exec( item );
			podcastItem.duration = splitDuration[ 1 ];
		} else if ( /<itunes:duration>([\s\S]*?)<\/itunes:duration>/gim.test( item ) ) {
			podcastItem.duration = /<itunes:duration>([\s\S]*?)<\/itunes:duration>/gim.exec(
				item
			)[ 1 ];
		}
		if ( /<itunes:image href="([\s\S]*?)" \/>/gim.test( item ) ) {
			podcastItem.cover = /<itunes:image href="([\s\S]*?)" \/>/gim.exec( item )[ 1 ];
		} else {
			podcastItem.cover = "";
		}
		podcastItem.guid = StripCDATA( /<guid isPermalink="false">([\s\S]*?)<\/guid>/gim.exec(
			item
		)[ 1 ] );
		podcastItem.media = null;
		let mediaSplit = [];
		let mediaNoSpaceSplitter = /<enclosure url="([\s\S]*?)" length="([\s\S]*?)" type="([\s\S]*?)"\/>/gim;
		if ( mediaNoSpaceSplitter.test( item ) ) {
			mediaNoSpaceSplitter.lastIndex = 0;
			mediaSplit = mediaNoSpaceSplitter.exec( item );
			podcastItem.media = {};
			podcastItem.media.url = mediaSplit[ 1 ];
			podcastItem.media.size = mediaSplit[ 2 ];
			podcastItem.media.type = mediaSplit[ 3 ];
		} else if (
			/<enclosure url="([\s\S]*?)" length="([\s\S]*?)" type="([\s\S]*?)" \/>/gim.test(
				item
			)
		) {
			mediaSplit = /<enclosure url="([\s\S]*?)" length="([\s\S]*?)" type="([\s\S]*?)" \/>/gim.exec(
				item
			);
			podcastItem.media = {};
			podcastItem.media.url = mediaSplit[ 1 ];
			podcastItem.media.size = mediaSplit[ 2 ];
			podcastItem.media.type = mediaSplit[ 3 ];
		}

		podcast.episodes.push( podcastItem );
	} );
	return podcast;
}

console.log( "Starting podcast api server..." );
