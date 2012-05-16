if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define(
  [ "src/resources/material-definition" ],
  function( MaterialDefinition ) {
    return function() {

      module( "MaterialDefinition", {
        setup: function() {},
        teardown: function() {}
      });



    };
  }
);