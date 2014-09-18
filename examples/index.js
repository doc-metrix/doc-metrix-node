/**
*
*	DEMO
*
*
*	DESCRIPTION:
*		- Demo for using the metrics API.
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
*		Athan Reines. athan@nodeprime.com. 2014.
*
*/

(function() {
	'use strict';

	// MODULES //

	var metrics = require( './../lib' );


	// SCRIPT //

	// Check if a metric exists:
	console.log( metrics.mexists( 'cpu.utilization' ) );

	/**
	* Returns:
	*	true
	*/

	console.log( metrics.mexists( 'unknown.metric.name' ) );

	/**
	* Returns:
	*	false
	*/

	// Get the list of metrics:
	console.log( metrics.mlist() );

	/**
	* Returns:
	*	[
	*		'metric0',
	*		'metric1',
	*		...
	*		'metricN'
	*	]
	*/

	// Filter the list of metrics:
	console.log( metrics.mfilter( /Utilization/i ) );

	/**
	* Returns:
	*	[
	*		'metric0',
	*		'metric1',
	*		...
	*		'metricM'
	*	]
	*/

	// Get a metric specification:
	console.log( metrics.mget( 'cpu.utilization' ) );

	/**
	* Returns:
	*	{
			"displayName": "...",
			"units": "...",
			...
		}
	*/

	// Get metric specifications matching a filter:
	console.log( metrics.mget( /Utilization/i ) );

	/**
	* Returns:
	*	{
			"metric0": {
				"displayName": "...",
				"units": "...",
				...
			},
			...
			"metricM": {
				"displayName": "...",
				"units": "...",
				...
			}
		}
	*/

	// Check if a device is known to have associated metrics:
	console.log( metrics.dexists( 'ram' ) );

	/**
	* Returns:
	*	true
	*/

	console.log( metrics.dexists( 'unknown_device_name' ) );

	/**
	* Returns:
	*	false
	*/

	// Get the list of devices:
	console.log( metrics.dlist() );

	/**
	* Returns:
	*	[
	*		'device0',
	*		'device1',
	*		...
	*		'deviceN'
	*	]
	*/

	// Get a list of metric specifications arranged by device name:
	console.log( metrics.dget( 'ram' ) );

	/**
	* Returns:
	*	{
			"metric0": {
				"displayName": "...",
				"units": "...",
				...
			},
			"metric1": {
				"displayName": "...",
				"units": "...",
				...
			},
			...
		}
	*/

})();



