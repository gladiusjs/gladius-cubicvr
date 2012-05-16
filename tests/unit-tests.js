if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function( require ) {

  return [

          "src/components/camera.test",
          "src/components/light.test",
          "src/components/model.test",
          "src/resources/light-definition.test",
          "src/services/renderer.test",
          "src/services/target.test"

          ];

});