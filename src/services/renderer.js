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
        updateEvent( component );
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

      // Render the space for each camera
      for( i = 0, l = cameraEntities.length; i < l; ++ i ) {
        var camera = cameraEntities[ i ].findComponent( "Camera" );

        cubicvrLights.forEach( function( light ) {
          light.prepare( camera._cubicvrCamera );
        });

        for( var mi = 0, ml = modelEntities.length; mi < ml; ++mi ) {
          var model = modelEntities[ mi ].findComponent( "Model" );
          var transform = modelEntities[ mi ].findComponent( "Transform" );

          model._cubicvrMesh.instanceMaterials = [model._cubicvrMaterialDefinition];

          context.renderObject(
              model._cubicvrMesh,
              camera._cubicvrCamera,
              transform.absolute(),
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