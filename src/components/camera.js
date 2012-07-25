if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function( require ) {

  var extend = require( "common/extend" );
  var Component = require( "base/component" );
  var math = require( "_math" );

  var Camera = function( service, options ) {
    Component.call( this, "Camera", service, ["Transform"] );

    options = options || {};

    this._cubicvrCamera = new service.target.context.Camera({
      width: service.target.context.width,
      height: service.target.context.height,
      fov: 60,
      calcNormalMatrix: true,
      targeted: (options.targeted === undefined) ? false : options.targeted
    });
    this._cubicvrCamera.parent = {
      tMatrix: new math.T()
    };

    this.target = [0, 0, 0];
    this._targetHasChanged = false;

    this._cubicvrCamera.lookat( this.target );
  };
  Camera.prototype = new Component();
  Camera.prototype.constructor = Camera;

  function onUpdate( event ) {
    math.matrix4.transpose(this.owner.findComponent( "Transform" ).worldMatrix(), this._cubicvrCamera.parent.tMatrix);
    if( this._targetHasChanged ) {
      this._cubicvrCamera.lookat( this.target );
      this._targetHasChanged = false;
    }
    this._cubicvrCamera.calcProjection();
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

    if( this.owner ) {
      math.matrix4.transpose(this.owner.findComponent( "Transform" ).worldMatrix(), this._cubicvrCamera.parent.tMatrix);
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

  function setTarget( target ) {
    this.target = target;
    this._targetHasChanged = true;
  }

  var prototype = {
    onUpdate: onUpdate,
    onEntitySpaceChanged: onEntitySpaceChanged,
    onComponentOwnerChanged: onComponentOwnerChanged,
    onEntityActivationChanged: onEntityActivationChanged,
    setTarget: setTarget
  };
  extend( Camera.prototype, prototype );

  return Camera;

});