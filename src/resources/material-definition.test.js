if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define(
  [ "src/resources/material-definition", 
    "src/services/target" ],
  function( MaterialDefinition, Target ) {
    return function() {

      module( "MaterialDefinition", {
        setup: function() {
          var canvasElement = document.getElementById("test-canvas");
          this.target = new Target( canvasElement );
          this.service = {
            target: this.target
          };
        },
        teardown: function() {}
      });

      test( "cubicVR materialDefinition exists", function() {
        expect( 1 );

        var materialDefinition = new MaterialDefinition(this.service);
        ok(materialDefinition.hasOwnProperty("materialDefinition"), "materialDefinition is wrapping a cubic VR materialDefinition");
      });

      test ( "gladius dictionary exists", function() {
        expect( 1 );

        var materialDefinition = new MaterialDefinition(this.service);
        ok(materialDefinition.hasOwnProperty("_gladius"), "materialDefinition has a gladius dictionary");
      });

    };
  }
);