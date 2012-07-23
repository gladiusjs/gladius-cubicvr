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
      tMatrix: []
    };
    _convertToCVRMatrix(this._cubicvrCamera.parent.tMatrix, math.matrix4.identity);

    this.target = [0, 0, 0];
    this._targetHasChanged = false;

    this._cubicvrCamera.lookat( this.target );
  };
  Camera.prototype = new Component();
  Camera.prototype.constructor = Camera;

  function onUpdate( event ) {
    _convertToCVRMatrix(this._cubicvrCamera.parent.tMatrix, this.owner.findComponent("Transform").worldMatrix());
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
      _convertToCVRMatrix(this._cubicvrCamera.parent.tMatrix, this.owner.findComponent("Transform").worldMatrix());
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

  function _convertToCVRMatrix(cvrMatrix, gladiusMatrix){
    //Swap out indexes 12, 13, 14 for 3, 7, 11
    cvrMatrix[0] = gladiusMatrix[0];
    cvrMatrix[1] = gladiusMatrix[4];
    cvrMatrix[2] = gladiusMatrix[8];
    cvrMatrix[3] = gladiusMatrix[12];
    cvrMatrix[4] = gladiusMatrix[1];
    cvrMatrix[5] = gladiusMatrix[5];
    cvrMatrix[6] = gladiusMatrix[9];
    cvrMatrix[7] = gladiusMatrix[13];
    cvrMatrix[8] = gladiusMatrix[2];
    cvrMatrix[9] = gladiusMatrix[6];
    cvrMatrix[10] = gladiusMatrix[10];
    cvrMatrix[11] = gladiusMatrix[14];
    cvrMatrix[12] = gladiusMatrix[3];
    cvrMatrix[13] = gladiusMatrix[7];
    cvrMatrix[14] = gladiusMatrix[11];
    cvrMatrix[15] = gladiusMatrix[15];
    return cvrMatrix;
  }

  var prototype = {
    onUpdate: onUpdate,
    onEntitySpaceChanged: onEntitySpaceChanged,
    onComponentOwnerChanged: onComponentOwnerChanged,
    onEntityActivationChanged: onEntityActivationChanged,
    setTarget: setTarget,
    _convertToCVRMatrix: _convertToCVRMatrix
  };
  extend( Camera.prototype, prototype );

  return Camera;

});