if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define(
  [ "src/components/camera" ],
  function( Camera ) {
    return function() {

      module( "Camera", {
        setup: function() {},
        teardown: function() {}
      });

    };
  }
);