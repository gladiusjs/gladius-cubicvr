if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define(
  [ "src/components/model",
    "src/resources/material-definition",
    "src/resources/mesh",
    "src/services/target"],
  function( Model, MaterialDefinition, Mesh, Target ) {
    return function() {

      module( "Model", {
        setup: function() {
          var canvasElement = document.getElementById("test-canvas");
          this.target = new Target( canvasElement );
          this.service = {
            target: this.target
          };
        },
        teardown: function() {}
      });

      test( "getMaterialDefinition and setMaterialDefinition work correctly", function() {
        expect( 2 );

        var model = new Model(this.service);
        var materialDefinition = new MaterialDefinition(this.service);
        model.setMaterialDefinition(materialDefinition);

        equal(model.getMaterialDefinition(), materialDefinition, "material definition was set correctly");
        model.setMaterialDefinition();
        equal(model.getMaterialDefinition(), undefined, "material definition is cleared");
      });

      test( "getMesh and setMesh work correctly", function() {
        expect( 2 );

        var model = new Model(this.service);
        var mesh = new Mesh(this.service);
        model.setMesh(mesh);

        equal(model.getMesh(), mesh, "mesh was set correctly");
        model.setMesh();
        equal(model.getMesh(), undefined, "mesh is cleared");
      });
    };
  }
);