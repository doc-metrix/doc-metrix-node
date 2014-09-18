#!/usr/bin/env node
/**
*
*	SCRIPTS: spec
*
*
*	DESCRIPTION:
*		- Retrieves metric specifications.
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


	// SPECIFICATIONS //

	var resources = {},
		names = [
			'memory',
			'cpu',
			'disk',
			'network',
			'general'
		];

	// NOTE: no specification should be named 'index'. This is a reserved name.

	names.map( function ( name ) {
		resources[ name ] = 'https://raw.githubusercontent.com/doc-metrix/' + name + '/master/spec/index.json';
	});


	// VARIABLES //

	var filepath = path.resolve( __dirname, '../specs' );


	// FUNCTIONS //

	/**
	* FUNCTION: getSpecs()
	*	Retrieves the latest specifications.
	*
	* @private
	*/
	function getSpecs() {
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
	} // end FUNCTION getSpecs()

	/**
	* FUNCTION: getClbk( total )
	*	Returns a callback which merges individual specifications into a single specification.
	*
	* @private
	* @param {Number} total - number of specifications to merge
	* @returns {Function} callback to invoke upon receiving a specification
	*/
	function getClbk( total ) {
		var SPEC = {},
			counter = 0;
		/**
		* FUNCTION: merge( spec )
		*	Merges an individual specification into a single spec.
		*
		* @private
		* @param {Object} spec - metric specification
		*/
		return function merge( spec ) {
			var metrics = Object.keys( spec ),
				metric;
			for ( var i = 0; i < metrics.length; i++ ) {
				metric = metrics[ i ];
				if ( SPEC.hasOwnProperty( metric ) ) {
					// Print a warning...
					console.warn( 'Duplicate name found when merging multiple specifications: ' + metric + '. Overwriting previous assigned value.' );
				}
				SPEC[ metric ] = spec[ metric ];
			}
			if ( ++counter === total ) {
				writeToFile();
			}
		};

		/**
		* FUNCTION: writeToFile()
		*	Writes the merged specification to file.
		*
		* @private
		*/
		function writeToFile() {
			var filename = path.join( filepath, 'index.json' );
			fs.writeFile( filename, JSON.stringify( SPEC ), 'utf8', function onError( error ) {
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
	* @param {Function} clbk - callback to invoke after returning a specification
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
			var spec;
			if ( error ) {
				throw new Error( error );
			}
			if ( !body ) {
				throw new Error( 'Error when retrieving metric specification: ' + name + '.' );
			}
			try {
				spec = JSON.parse( body );
			} catch ( err ) {
				console.log( body );
				throw new Error( 'Unable to parse body content as JSON for metric specification: ' + name + '.' );
			}
			fs.writeFile( filename, body, 'utf8', function onError( error ) {
				if ( error ) {
					throw new Error( error );
				}
				clbk( spec );
			});
		}; // end FUNCTION onResponse()
	} // end FUNCTION onResponse()


	// RUN //

	getSpecs();

})();