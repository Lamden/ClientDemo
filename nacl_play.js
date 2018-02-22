var keyPair = null;

// FOR TESTING (signing_key, public_key)
var STU = ['373ac0ec93038e4235c4716183afe55dab95f5d780415f60e7dd5363a2d2fd10',
       '403619540f4dfadc2da892c8d37bf243cd8d5a8e6665bc615f6112f0c93a3b09'];
var DAVIS = ['1f4be9265694ec059e11299ab9a5edce314f28accab38e09d770af36b1edaa27',
         '6fbc02647179786c10703f7fb82e625c05ede8787f5eeff84c5d9be03ff59ce8'];
// END TESTING

function get_signature(payload) {
  var enc = new TextEncoder("utf-8");
  var payload_encoded = enc.encode(JSON.stringify(payload));
  var byte_sig = nacl.sign(payload_encoded, keyPair['secretKey']);
  return byteToHexString(byte_sig);
}

function get_pow(payload) {
  return "00000";
}

function sendCoin() {
  if (!keyPair) {
    console.log("Error: keypair not set!");
    alert("you gotta load ur wallet first my guy");
    return;
  }

  var payload = {};
  var metadata = {};
  // NOTE: I think these values MUST but set in lexigraphical order for the
  // signatures and POW to work as expected on the backend
  // payload['amount'] = $("input[name='amount']").val();
  // payload['from'] = $("input[name='verifying_key']").val();
  // payload['to'] = $("input[name='recipient']").val();
  payload['type'] = "t";
  payload['from'] = STU[1];
  payload['to'] = DAVIS[1];
  payload['amount'] = "10";

  metadata['signature'] = get_signature(payload);
  metadata['proof'] = get_pow(payload);

  var tx = {'payload': payload, 'metadata': metadata};

  console.log("tx: " + JSON.stringify(tx));

  formatted_payload = turnPayloadToList(tx);

  var tx_formatted = {'payload': formatted_payload, 'metadata': metadata};
  console.log("tx formatted: " + JSON.stringify(tx_formatted));

  setStatusDiv();
}

function loadWallet() {
  var signing_key = $("input[name='signing_key']").val();
  console.log("loading keypair for signing key: " + signing_key);

  var s = hexStringToByte(signing_key);
  keyPair = nacl.sign.keyPair.fromSecretKey(s);

  setWalletDiv();
}

function generateWallet() {
  keyPair = nacl.sign.keyPair();

  console.log(keyPair);
  setWalletDiv();
}

function setWalletDiv() {
  var publicKey = byteToHexString(keyPair['publicKey']);
  var secretKey = byteToHexString(keyPair['secretKey']);
  $("#wallet_div").text("Public Key: " + publicKey + "  Secret Key: " + secretKey);
}


function byteToHexString(uint8arr) {
  if (!uint8arr) {
    return '';
  }

  var hexStr = '';
  for (var i = 0; i < uint8arr.length; i++) {
    var hex = (uint8arr[i] & 0xff).toString(16);
    hex = (hex.length === 1) ? '0' + hex : hex;
    hexStr += hex;
  }

  return hexStr;
}

function hexStringToByte(str) {
  if (!str) {
    return new Uint8Array();
  }

  var a = [];
  for (var i = 0, len = str.length; i < len; i+=2) {
    a.push(parseInt(str.substr(i,2),16));
  }

  return new Uint8Array(a);
}

function setStatusDiv() {
  $("#send_result").text("Transaction Sent!");
}

function turnPayloadToList(tx) {
  var payload_list = $.map(tx['payload'], function(value, index) {
    return [value];
  })
  return payload_list
};