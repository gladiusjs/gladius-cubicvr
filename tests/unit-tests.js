if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function( require ) {

  return [

          "components/camera.test",
          "components/light.test",
          "components/model.test",
          "resources/light-definition.test",
          "services/renderer.test",
          "services/target.test"

          ];

});