if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function ( require ) {

    var LightDefinition = require( "src/resources/light-definition" );
    var math = require( "_math" );
    var Component = require( "base/component" );
    var extend = require( "common/extend" );

    //Assign all of these values to the cubicVRLight
    var properties = [
      "light_type",
      "diffuse",
      "specular",
      "intensity",
      "distance",
      "cutoff",
      "map_res",
      "method",
      "areaCeiling",
      "areaFloor",
      "areaAxis"
    ];

    var Light = function( service, lightDefinition ){
      Component.call(this, "Light", service, ["Transform"]);

      if (!(lightDefinition instanceof LightDefinition)){
        lightDefinition = new LightDefinition();
      }

      this._cubicvrLight = new service.target.context.Light(lightDefinition);

      for (var propertyIndex = 0; propertyIndex < properties.length; propertyIndex++){
        this[properties[propertyIndex]] = lightDefinition[properties[propertyIndex]];
      }

    };
    Light.prototype = new Component();
    Light.prototype.constructor = Light;

    function onUpdate(event){
      for (var propertyIndex = 0; propertyIndex < properties.length; propertyIndex++){
        this._cubicvrLight[properties[propertyIndex]] = this[properties[propertyIndex]];
      }
      //This should return the absolute light position
      this._cubicvrLight.position = math.matrix4.multiplyVector3(this.owner.findComponent( "Transform" ).absolute(), [ 0, 0, 0]);
      //this._cubicvrLight.rotation = this.owner.findComponent( "Rotation" ).absolute();
    }

    function onEntitySpaceChanged( event ) {
      var data = event.data;
      if( data.previous === null && data.current !== null && this.owner !== null ) {
        this.provider.registerComponent( this.owner.id, this );
      }

      if( data.previous !== null && data.current === null && this.owner !== null ) {
        this.provider.unregisterComponent( this.owner.id, this );
      }
    }

    function onComponentOwnerChanged( event ) {
      var data = event.data;
      if( data.previous === null && this.owner !== null ) {
        this.provider.registerComponent( this.owner.id, this );
      }

      if( this.owner === null && data.previous !== null ) {
        this.provider.unregisterComponent( data.previous.id, this );
      }
    }

    function onEntityActivationChanged( event ) {
      var active = event.data;
      if( active ) {
        this.provider.registerComponent( this.owner.id, this );
      } else {
        this.provider.unregisterComponent( this.owner.id, this );
      }
    }

    var prototype = {
      onUpdate: onUpdate,
      onEntitySpaceChanged: onEntitySpaceChanged,
      onComponentOwnerChanged: onComponentOwnerChanged,
      onEntityActivationChanged: onEntityActivationChanged
    };
    extend( Light.prototype, prototype );

    return Light;

  });