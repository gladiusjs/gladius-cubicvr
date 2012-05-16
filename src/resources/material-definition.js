if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function ( require ) {

  // Textures are not explicitly supported. When we do, they
  // should be specified as URLs that can be loaded when the
  // MaterialDefinition is constructed.

  var MaterialDefinition = function( service, data ) {
    return new service.target.context.Material( data );
  };

  return MaterialDefinition;

});