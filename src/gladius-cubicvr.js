if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function ( require ) {

  var Extension = require( "base/extension" );

  return new Extension( "gladius-cubicvr", {
      
      services: {
        "renderer": {
          service: require( "src/services/renderer" ),
          components: {
            "Camera": require( "src/components/camera" ),
            "Light": require( "src/components/light" ),
            "Model": require( "src/components/model" )
          },
          resources: {
            "Mesh": require( "src/resources/mesh" ),
            "MaterialDefinition": require( "src/resources/material-definition" )
            // "Texture": require( "src/resources/texture" )
          }
        }
      },
      
      components: {
      },
      
      resources: {
        "LightDefinition": require( "src/resources/light-definition" )
      }
      
  });

});