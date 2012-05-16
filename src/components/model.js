if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function() {

  var extend = require( "common/extend" );
  var Component = require( "base/component" );

  var Model = function( service, mesh, materialDefinition ) {

  };
  Model.prototype = new Component();
  Model.prototype.constructor = Model;

  function onUpdate( event ) {
    
  }

  var prototype = {
    onUpdate: onUpdate
  };
  extend( Model.prototype, prototype );

  return Model;

});