'use strict';
var crypto = require('crypto');
var fs = require('fs');

function readFromFileIfIsPath(publicKey) {
  try {
    return fs.readFileSync(publicKey, 'utf-8');
  } catch (e) {
    return publicKey;
  }
}

function Verifier(publicKey) {
  publicKey = readFromFileIfIsPath(publicKey);
  return  function(body, signature) {
    let verifier = crypto.createVerify('RSA-SHA256').update(body, "utf8");
    return verifier.verify(publicKey, signature, 'base64');
  };
}

function ExpressPingppVerifier(publicKey, statusCode, errorResponse) {
  publicKey = readFromFileIfIsPath(publicKey);
  statusCode = statusCode || 400;
  errorResponse = errorResponse || '';
  return function(req, res, next) {
    let body = req.body.toString();
    let signature = req.get('x-pingplusplus-signature');
    let verifier = crypto.createVerify('RSA-SHA256').update(body, 'utf8');
    if (verifier.verify(publicKey, signature, 'base64')) {
      req.body = JSON.parse(body);
      next();
    } else {
      res.status(statusCode).send(errorResponse);
    }
  };
}

function ExpressPingppVerifierTest(publicKey, statusCode, errorResponse) {
  publicKey = readFromFileIfIsPath(publicKey);
  statusCode = statusCode || 400;
  errorResponse = errorResponse || '';
  return function(req, res, next) {
    let body = req.body.toString();
    let signature = req.get('x-pingplusplus-signature');
    let verifier = crypto.createVerify('RSA-SHA256').update(body, 'utf8');
    if (req.get('bypass-signature') || verifier.verify(publicKey, signature, 'base64')) {
      req.body = JSON.parse(body);
      next();
    } else {
      res.status(statusCode).send(errorResponse);
    }
  };
}

module.exports = {
  ExpressPingppVerifier: ExpressPingppVerifier,
  ExpressPingppVerifierTest: ExpressPingppVerifierTest,
  Verifier: Verifier
};