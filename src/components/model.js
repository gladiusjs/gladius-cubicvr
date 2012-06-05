if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function( require ) {

  var extend = require( "common/extend" );
  var Component = require( "base/component" );

  var Model = function( service, mesh, materialDefinition ) {
    Component.call( this, "Model", service, ["Transform"] );

    this._cubicvrMesh = null;
    this._cubicvrMaterialDefinition = null;

    setMesh.call( this, mesh || new service.target.context.Mesh() );
    setMaterialDefinition.call( this, materialDefinition || new service.target.context.Material() );
  };
  Model.prototype = new Component();
  Model.prototype.constructor = Model;

  function setMaterialDefinition( materialDefinition ){
    this._cubicvrMaterialDefinition = materialDefinition;
  }

  function getMaterialDefinition(){
    return this._cubicvrMaterialDefinition;
  }

  function setMesh( mesh ) {
    this._cubicvrMesh = mesh;
  }

  function getMesh() {
    return this._cubicvrMesh;
  }

  function onUpdate( event ) {
  }

  function onEntitySpaceChanged( event ) {
    var data = event.data;
    if( data.previous === null && data.current !== null && this.owner !== null ) {
      this.provider.registerComponent( this.owner.id, this );
    }
    
    if( data.previous !== null && data.current === null && this.owner !== null ) {
      this.provider.unregisterComponent( this.owner.id, this );
    }
  }

  function onComponentOwnerChanged( event ) {
    var data = event.data;
    if( data.previous === null && this.owner !== null ) {
      this.provider.registerComponent( this.owner.id, this );
    }

    if( this.owner === null && data.previous !== null ) {
      this.provider.unregisterComponent( data.previous.id, this );
    }
  }

  function onEntityActivationChanged( event ) {
    var active = event.data;
    if( active ) {
      this.provider.registerComponent( this.owner.id, this );
    } else {
      this.provider.unregisterComponent( this.owner.id, this );
    }
  }

  var prototype = {
    getMaterialDefinition: getMaterialDefinition,
    setMaterialDefinition: setMaterialDefinition,
    getMesh: getMesh,
    setMesh: setMesh,
    onUpdate: onUpdate,
    onEntitySpaceChanged: onEntitySpaceChanged,
    onComponentOwnerChanged: onComponentOwnerChanged,
    onEntityActivationChanged: onEntityActivationChanged
  };
  extend( Model.prototype, prototype );

  return Model;

});