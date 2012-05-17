if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function ( require ) {

  var Mesh = function( service, data ) {
    var mesh = new service.target.context.Mesh( data );
    mesh._gladius = {};
    mesh.prepare();
    return mesh;
  };

  return Mesh;

});