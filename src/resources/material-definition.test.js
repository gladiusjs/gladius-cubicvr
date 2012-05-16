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

      test( "base prototype", function() {
        expect( 1 );

        var materialDefinition = new MaterialDefinition(this.service);
        ok( materialDefinition instanceof this.service.target.context.Material, "material definition is instance of cubicvr material" );
      });

      test ( "gladius dictionary exists", function() {
        expect( 1 );

        var materialDefinition = new MaterialDefinition(this.service);
        ok(materialDefinition.hasOwnProperty("_gladius"), "material definition has a gladius dictionary");
      });

    };
  }
);