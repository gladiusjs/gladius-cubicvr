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
  }

  function onEntitySpaceChanged( event ) {
    var data = event.data;
    if( data.previous === null && data.current !== null && this.owner !== null ) {
      service.registerComponent( this.owner.id, this );
    }
    
    if( data.previous !== null && data.current === null && this.owner !== null ) {
      service.unregisterComponent( this.owner.id, this );
    }
  }

  function onComponentOwnerChanged( event ) {
    var data = event.data;
    if( data.previous === null && this.owner !== null ) {
      service.registerComponent( this.owner.id, this );
    }

    if( this.owner === null && data.previous !== null ) {
      service.unregisterComponent( data.previous.id, this );
    }
  }

  function onEntityActivationChanged( event ) {
    var active = event.data;
    if( active ) {
      service.registerComponent( this.owner.id, this );
    } else {
      service.unregisterComponent( this.owner.id, this );
    }
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