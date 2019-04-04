"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OwnershipError = function (_Error) {
  _inherits(OwnershipError, _Error);

  function OwnershipError() {
    _classCallCheck(this, OwnershipError);

    var _this = _possibleConstructorReturn(this, (OwnershipError.__proto__ || Object.getPrototypeOf(OwnershipError)).call(this));

    _this.name = "OwnershipError";
    _this.message = "The provided token does not match the owner of this document";
    return _this;
  }

  return OwnershipError;
}(Error);

var DocumentNotFoundError = function (_Error2) {
  _inherits(DocumentNotFoundError, _Error2);

  function DocumentNotFoundError() {
    _classCallCheck(this, DocumentNotFoundError);

    var _this2 = _possibleConstructorReturn(this, (DocumentNotFoundError.__proto__ || Object.getPrototypeOf(DocumentNotFoundError)).call(this));

    _this2.name = "DocumentNotFoundError";
    _this2.message = "The provided ID doesn't match any documents";
    return _this2;
  }

  return DocumentNotFoundError;
}(Error);

var BadParamsError = function (_Error3) {
  _inherits(BadParamsError, _Error3);

  function BadParamsError() {
    _classCallCheck(this, BadParamsError);

    var _this3 = _possibleConstructorReturn(this, (BadParamsError.__proto__ || Object.getPrototypeOf(BadParamsError)).call(this));

    _this3.name = "BadParamsError";
    _this3.message = "A required parameter was omitted or invalid";
    return _this3;
  }

  return BadParamsError;
}(Error);

var JWTExpiredError = function (_Error4) {
  _inherits(JWTExpiredError, _Error4);

  function JWTExpiredError() {
    _classCallCheck(this, JWTExpiredError);

    var _this4 = _possibleConstructorReturn(this, (JWTExpiredError.__proto__ || Object.getPrototypeOf(JWTExpiredError)).call(this));

    _this4.name = "JWTExpiredError";
    _this4.message = "your token expired";
    return _this4;
  }

  return JWTExpiredError;
}(Error);

var BadCredentialsError = function (_Error5) {
  _inherits(BadCredentialsError, _Error5);

  function BadCredentialsError() {
    _classCallCheck(this, BadCredentialsError);

    var _this5 = _possibleConstructorReturn(this, (BadCredentialsError.__proto__ || Object.getPrototypeOf(BadCredentialsError)).call(this));

    _this5.name = "BadCredentialsError";
    _this5.message = "The provided username or password is incorrect";
    return _this5;
  }

  return BadCredentialsError;
}(Error);

// this method checks if the user trying to modify a resource is the owner of
// resource, and throws an error if not

// `requestObject` should be the actual `req` object from the route file


var requireOwnership = function requireOwnership(requestObject, resource) {
  // `requestObject.user` will be defined in any route that uses `requireToken`
  // `requireToken` MUST be passed to the route as a second argument
  if (!requestObject.user._id.equals(resource.owner)) {
    throw new OwnershipError();
  }
};

// if the client passes an ID that isn't in the DB, we want to return 404
var handle404 = function handle404(record) {
  if (!record) {
    throw new DocumentNotFoundError();
  } else {
    return record;
  }
};

exports.requireOwnership = requireOwnership;
exports.handle404 = handle404;
exports.BadParamsError = BadParamsError;
exports.BadCredentialsError = BadCredentialsError;
exports.JWTExpiredError = JWTExpiredError;
exports.OwnershipError = OwnershipError;