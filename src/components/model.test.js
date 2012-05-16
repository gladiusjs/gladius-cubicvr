if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define(
  [ "src/components/model" ],
  function( Model ) {
    return function() {

      module( "Model", {
        setup: function() {},
        teardown: function() {}
      });

    };
  }
);