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

      test( "base prototype", function() {
        expect( 1 );

        var mesh = new Mesh(this.service);
        ok( mesh instanceof this.service.target.context.Mesh, "mesh is instance of cubicvr mesh" );
      });

      test ( "gladius dictionary exists", function() {
        expect( 1 );

        var mesh = new Mesh(this.service);
        ok(mesh.hasOwnProperty("_gladius"), "mesh has a gladius dictionary");
      });
    };
  }
);