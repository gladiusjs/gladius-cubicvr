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
            // "Camera": require( "components/camera" ),
            "Light": require( "src/components/light" )
          },
          resources: {
            "Mesh": require( "src/resources/mesh" ),
            // "MaterialDefinition": require( "resources/material-definition" )
          }
        }
      },
      
      components: {
        // "Model": require( "components/model" )
      },
      
      resources: {
        "LightDefinition": require( "src/resources/light-definition" )
      }
      
  });

});