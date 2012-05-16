if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function( require ) {

  var extend = require( "common/extend" );
  var Component = require( "base/component" );

  var Model = function( service, mesh, materialDefinition ) {
    this.mesh = mesh || new service.target.context.Mesh();
    this.materialDefinition = materialDefinition || 
      new service.target.context.Material();
  };
  Model.prototype = new Component();
  Model.prototype.constructor = Model;

  function onUpdate( event ) {
    if( this.mesh && this.materialDefinition ) {
      
    }
  }

  function onEntitySpaceChanged( event ) {

  }

  function onComponentOwnerChanged( event ) {

  }

  function onEntityActivationChanged( event ) {

  }

  var prototype = {
    onUpdate: onUpdate,
    onEntitySpaceChanged: onEntitySpaceChanged,
    onComponentOwnerChanged: onComponentOwnerChanged,
    onEntityActivationChanged: onEntityActivationChanged
  };
  extend( Model.prototype, prototype );

  return Model;

});