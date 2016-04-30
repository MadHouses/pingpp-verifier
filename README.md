![npm download](https://img.shields.io/npm/dt/pingpp-verifier.svg)
![npm version](https://img.shields.io/npm/v/pingpp-verifier.svg)

verifier for Ping++ webhook message

## Document

See [Ping++ webhook](https://www.pingxx.com/guidance/webhooks)

## Installation

```sh
$ npm install pingpp-verifier
```

## General Usage
```js
var pingppVerifier = require('pingpp-verifier');

// the public key could be a file path or a String
const publicKey = 'your key';
const publicKey = '/path/to/pub.pem';

// Integrate with your program
pingppVerifier.Verifier(publicKey);

// Express middleware
router.use(
  '/webhook',
  bodyParser.raw({
    type: '*/*'
  }),
  pingppVerifier.ExpressPingppVerifier(publicKey));

// Express middleware with bypass
// if you send a request with header 'bypass-signature', it will skip the check
router.use(
  '/webhook',
  bodyParser.raw({
    type: '*/*'
  }),
  pingppVerifier.ExpressPingppVerifierTest(publicKey));
```

## License

![license](https://img.shields.io/npm/l/pingpp-verifier.svg)