if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define(
  [
    "src/components/camera",
    "src/services/target"
  ],
  function( Camera , Target) {
    return function() {

      module( "Camera", {
        setup: function() {
          var canvasElement = document.getElementById("test-canvas");
          this.target = new Target( canvasElement );
          this.service = {
            target: this.target
          };
        },
        teardown: function() {}
      });

      test("update handler", function() {
        expect(1);
        var camera = new Camera(this.service);
        ok( "onUpdate" in camera, "camera has update handler");
      });

      test("cubicvr camera exists", function(){
        expect(1);
        var camera = new Camera(this.service);
        ok(camera.hasOwnProperty("_cubicVRCamera"), "camera is wrapping a cubicvr camera");
      });

    };
  }
);