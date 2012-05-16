if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define(
  [ "src/resources/mesh", 
    "src/services/target" ],
  function( Mesh, Target ) {
    return function() {

      module( "Mesh", {
        setup: function() {
          var canvasElement = document.getElementById("test-canvas");
          this.target = new Target( canvasElement );
          this.service = {
            target: this.target
          };
        },
        teardown: function() {}
      });

      test( "cubicVR mesh exists", function() {
        expect( 1 );

        var mesh = new Mesh(this.service);
        ok(mesh.hasOwnProperty("mesh"), "mesh is wrapping a cubic VR mesh");
      });

      test ( "gladius dictionary exists", function() {
        expect( 1 );

        var mesh = new Mesh(this.service);
        ok(mesh.hasOwnProperty("_gladius"), "mesh has a gladius dictionary");
      });
    };
  }
);