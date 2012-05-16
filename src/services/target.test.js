if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define(
  [ "src/services/target" ],
  function( Target ) {
    return function() {

      module( "Target", {
        setup: function() {},
        teardown: function() {}
      });

    };
  }
);