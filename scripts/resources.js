#!/usr/bin/env node
/**
*
*	SCRIPTS: resources
*
*
*	DESCRIPTION:
*		- Retrieves metric resources.
*
*
*	NOTES:
*		[1] 
*
*
*	TODO:
*		[1] 
*
*
*	LICENSE:
*		MIT
*
*	Copyright (c) 2014. Athan Reines.
*
*
*	AUTHOR:
*		Athan Reines. kgryte@gmail.com. 2014.
*
*/

(function() {
	'use strict';

	// MODULES //

	var fs = require( 'fs' ),
		path = require( 'path' ),
		request = require( 'request' );


	// RESOURCES //

	var resources = {},
		names = [
			'memory',
			'cpu',
			'disk',
			'network',
			'general'
		];

	// NOTE: no resource should be named 'index'. This is a reserved name.

	names.map( function ( name ) {
		resources[ name ] = 'https://raw.githubusercontent.com/doc-metrix/' + name + '/master/doc/index.json';
	});


	// VARIABLES //

	var filepath = path.resolve( __dirname, '../docs' );


	// FUNCTIONS //

	/**
	* FUNCTION: getResources()
	*	Retrieves the latest metric resources.
	*
	* @private
	*/
	function getResources() {
		var keys = Object.keys( resources ),
			numKeys = keys.length,
			clbk = getClbk( numKeys );

		if ( !fs.existsSync( filepath ) ) {
			fs.mkdirSync( filepath );
		}
		for ( var i = 0; i < numKeys; i++ ) {
			request({
				'method': 'GET',
				'uri': resources[ keys[i] ]
			}, onResponse( keys[i], clbk ) );
		}
	} // end FUNCTION getResources()

	/**
	* FUNCTION: getClbk( total )
	*	Returns a callback which merges individual documentation into a compiled documentation object.
	*
	* @private
	* @param {Number} total - number of docs to merge
	* @returns {Function} callback to invoke upon receiving metric documentation
	*/
	function getClbk( total ) {
		var DOC = {},
			counter = 0;
		/**
		* FUNCTION: merge( doc )
		*	Merges an individual documentation into a single object.
		*
		* @private
		* @param {Object} doc - metric documentation
		*/
		return function merge( doc ) {
			var metrics = Object.keys( doc ),
				metric;
			for ( var i = 0; i < metrics.length; i++ ) {
				metric = metrics[ i ];
				if ( DOC.hasOwnProperty( metric ) ) {
					// Print a warning...
					console.warn( 'Duplicate name found when merging multiple documentation resources: ' + metric + '. Overwriting previous assigned value.' );
				}
				DOC[ metric ] = doc[ metric ];
			}
			if ( ++counter === total ) {
				writeToFile();
			}
		};

		/**
		* FUNCTION: writeToFile()
		*	Writes the merged documentation to file.
		*
		* @private
		*/
		function writeToFile() {
			var filename = path.join( filepath, 'index.json' );
			fs.writeFile( filename, JSON.stringify( DOC ), 'utf8', function onError( error ) {
				if ( error ) {
					throw new Error( error );
				}
			});
		} // end FUNCTION writeToFile()
	} // end FUNCTION getClbk()

	/**
	* FUNCTION: onResponse( name, clbk )
	*	Returns an HTTP response handler.
	* 
	* @private
	* @param {String} name - resource name
	* @param {Function} clbk - callback to invoke after returning a resource
	* @returns {Function} response handler
	*/
	function onResponse( name, clbk ) {
		var filename = path.join( filepath, name+'.json' );
		/**
		* FUNCTION: onResponse( error, response, body )
		*	Handler for HTTP response.
		*
		* @private
		* @param {Object} error - error object
		* @param {Object} response - HTTP response object
		* @param {Object} body - response body
		*/
		return function onResponse( error, response, body ) {
			var doc;
			if ( error ) {
				throw new Error( error );
			}
			if ( !body ) {
				throw new Error( 'Error when retrieving metric resource: ' + name + '.' );
			}
			try {
				doc = JSON.parse( body );
			} catch ( err ) {
				console.log( body );
				throw new Error( 'Unable to parse body content as JSON for metric resource: ' + name + '.' );
			}
			fs.writeFile( filename, body, 'utf8', function onError( error ) {
				if ( error ) {
					throw new Error( error );
				}
				clbk( doc );
			});
		}; // end FUNCTION onResponse()
	} // end FUNCTION onResponse()


	// RUN //

	getResources();

})();