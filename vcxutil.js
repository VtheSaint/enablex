/// ////////////////////////////////////////////////////
//
// This file contans utility functions to initiate RestAPI Calls
//
/// //////////////////////////////////////////////////

const btoa = require('btoa');
const https = require('https');
const ConfigOptions = require('./config')

const vcxutil = {};

// Function: To create basic authentication header using APP ID and APP KEY
vcxutil.getBasicAuthToken = () => btoa(`${ConfigOptions.app_id}:${ConfigOptions.app_key}`);

// Function: To connect to Enablex Server API Service
vcxutil.connectServer = (options, data, callback) => {

  const request = https.request(options, (res) => {
    res.on('data', (chunk) => {
      if (chunk.result === 0) {
        callback('success', JSON.parse(chunk));
      } else {
        callback('error', JSON.parse(chunk));
      }
    });
  });
  request.on('error', (err) => {
  });
  if (data == null) {
    request.end();
  } else {
    request.end(data);
  }
};

module.exports = vcxutil;
