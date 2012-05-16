if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function( require ) {

  var extend = require( "common/extend" );
  var Component = require( "base/component" );

  var Camera = function( service ) {
    Component.call( this, "Camera", service, ["Transform"] );

    this._cubicvrCamera = new service.target.context.Camera();
  };
  Camera.prototype = new Component();
  Camera.prototype.constructor = Camera;

  function onUpdate( event ) {

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
  extend( Camera.prototype, prototype );

  return Camera;

});