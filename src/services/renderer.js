if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function ( require ) {

  var Service = require( "base/service" );
  require( "CubicVR" );
  var Target = require( "src/services/target" );
  var Event = require( "core/event" );

  var Renderer = function( scheduler, options ) {
    options = options || {};
    
    var schedules = {
        "render": {
          tags: ["@render", "graphics"],
          dependsOn: []
        }
    };
    Service.call( this, scheduler, schedules );

    this.target = new Target( options.canvas );
  };

  function _convertToCVRMatrix(cvrMatrix, gladiusMatrix){
    //Swap out indexes 12, 13, 14 for 3, 7, 11
    cvrMatrix[0] = gladiusMatrix.buffer[0];
    cvrMatrix[1] = gladiusMatrix.buffer[1];
    cvrMatrix[2] = gladiusMatrix.buffer[2];
    cvrMatrix[3] = gladiusMatrix.buffer[12];
    cvrMatrix[4] = gladiusMatrix.buffer[4];
    cvrMatrix[5] = gladiusMatrix.buffer[5];
    cvrMatrix[6] = gladiusMatrix.buffer[6];
    cvrMatrix[7] = gladiusMatrix.buffer[13];
    cvrMatrix[8] = gladiusMatrix.buffer[8];
    cvrMatrix[9] = gladiusMatrix.buffer[9];
    cvrMatrix[10] = gladiusMatrix.buffer[10];
    cvrMatrix[11] = gladiusMatrix.buffer[14];
    cvrMatrix[12] = gladiusMatrix.buffer[3];
    cvrMatrix[13] = gladiusMatrix.buffer[7];
    cvrMatrix[14] = gladiusMatrix.buffer[11];
    cvrMatrix[15] = gladiusMatrix.buffer[15];
    return cvrMatrix;
  }

  function render() {
    var context = this.target.context;
    var registeredComponents = this._registeredComponents;
    var gl = context.GLCore.gl;
    var spaces = {};
    var sIndex, sLength;
    var component;

    // Update all graphics components
    var updateEvent = new Event( 'Update', undefined, false );
    for( var componentType in registeredComponents ) {
      for( var entityId in registeredComponents[componentType] ) {
        component = registeredComponents[componentType][entityId];
        while( component.handleQueuedEvent() ) {}
        updateEvent.dispatch( component );
      }
    }

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var cameraOwnerIds = Object.keys( registeredComponents["Camera"] || {} );
    cameraOwnerIds.forEach( function( id ) {
      var ownerSpace = registeredComponents["Camera"][id].owner.space;
      if( !spaces.hasOwnProperty( ownerSpace.id ) ) {
        spaces[ownerSpace.id] = ownerSpace;
      }
    });
    var spaceIds = Object.keys( spaces );

    for( sIndex = 0, sLength = spaceIds.length; sIndex < sLength; ++ sIndex ) {
      var spaceId = spaceIds[sIndex];
      var space = spaces[spaceId];
      var i, l;
      var cameraEntities = space.findAllWith( "Camera" );
      var modelEntities = space.findAllWith( "Model" );
      var lightEntities = space.findAllWith( "Light" );

      // Handle lights for the current space
      var cubicvrLights = [];
      for( i = 0, l = lightEntities.length; i < l; ++ i ) {
        var light = lightEntities[i].findComponent( "Light" );
        cubicvrLights.push( light._cubicvrLight );
      }

      var convertedTransform = [];
      // Render the space for each camera
      for( i = 0, l = cameraEntities.length; i < l; ++ i ) {
        var camera = cameraEntities[ i ].findComponent( "Camera" );

        cubicvrLights.forEach( function( light ) {
          light.prepare( camera._cubicvrCamera );
        });

        for( var mi = 0, ml = modelEntities.length; mi < ml; ++mi ) {
          var model = modelEntities[ mi ].findComponent( "Model" );
          var transform = modelEntities[ mi ].findComponent( "Transform" );
          _convertToCVRMatrix(convertedTransform, transform.worldMatrix());


          model._cubicvrMesh.instanceMaterials = [model._cubicvrMaterialDefinition];

          context.renderObject(
              model._cubicvrMesh,
              camera._cubicvrCamera,
              convertedTransform,
              cubicvrLights
          );

          model._cubicvrMesh.instanceMaterials = null;
        }
      }
    }
  }

  Renderer.prototype = new Service();
  Renderer.prototype.constructor = Renderer;
  Renderer.prototype.render = render;

  return Renderer;

});