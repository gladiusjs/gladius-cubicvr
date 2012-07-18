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
    cvrMatrix[0] = gladiusMatrix.getValue(0);
    cvrMatrix[1] = gladiusMatrix.getValue(1);
    cvrMatrix[2] = gladiusMatrix.getValue(2);
    cvrMatrix[3] = gladiusMatrix.getValue(12);
    cvrMatrix[4] = gladiusMatrix.getValue(4);
    cvrMatrix[5] = gladiusMatrix.getValue(5);
    cvrMatrix[6] = gladiusMatrix.getValue(6);
    cvrMatrix[7] = gladiusMatrix.getValue(13);
    cvrMatrix[8] = gladiusMatrix.getValue(8);
    cvrMatrix[9] = gladiusMatrix.getValue(9);
    cvrMatrix[10] = gladiusMatrix.getValue(10);
    cvrMatrix[11] = gladiusMatrix.getValue(14);
    cvrMatrix[12] = gladiusMatrix.getValue(3);
    cvrMatrix[13] = gladiusMatrix.getValue(7);
    cvrMatrix[14] = gladiusMatrix.getValue(11);
    cvrMatrix[15] = gladiusMatrix.getValue(15);
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