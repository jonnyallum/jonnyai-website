const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'Clients/Poundtrades.app-antigravity/poundtrades-v2/node_modules/react-native-worklets/plugin.js');

const shimContent = `module.exports = function() {
  return {
    name: 'worklets-shim',
    visitor: {}
  };
};`;

// Force write with explicit UTF-8 and no BOM
fs.writeFileSync(filePath, shimContent, { encoding: 'utf8' });

console.log('Shim successfully written to:', filePath);
