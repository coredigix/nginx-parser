'use strict';
/**
* Return indent to use in transformation
* @private
* @return {String} Indent
 */
/**
* Transform an node to string
* @private
* @param  {Object} node Node object
* @return {String}      Node as string
 */
var _getIndent, _stringFromNode, indentChar, indentLevel;

//#
//# Compile JSON to nginx config file
//#

// global
indentLevel = -1;

indentChar = '\t';

module.exports = function(data) {
  // error management
  if (typeof data !== 'object') {
    throw new Error('data must be an object');
  }
  // compile data
  return _stringFromNode(data);
};

_stringFromNode = function(node) {
  var dir, j, k, key, len, len1, location, nodeString, path, server, val;
  nodeString = '';
  indentLevel++;
  for (key in node) {
    val = node[key];
    // val is an array
    if (Array.isArray(val) && typeof val[0] !== 'object') {
      for (j = 0, len = val.length; j < len; j++) {
        dir = val[j];
        nodeString += _getIndent() + key + ' ' + dir + ';\n';
      }
    // val is an object
    } else if (typeof val === 'object') {
      // we are in server block
      if (key === 'server') {
        for (k = 0, len1 = val.length; k < len1; k++) {
          server = val[k];
          nodeString += _getIndent() + key + ' {\n' + _stringFromNode(server) + _getIndent() + '}\n';
        }
      // we are in location block
      } else if (key === 'location') {
        for (path in val) {
          location = val[path];
          nodeString += _getIndent() + key + ' ' + path + ' {\n' + _stringFromNode(location) + _getIndent() + '}\n';
        }
      } else {
        // Otherwise
        nodeString += _getIndent() + key + ' {\n' + _stringFromNode(val) + _getIndent() + '}\n';
      }
    } else {
      // val is an directive
      nodeString += _getIndent() + key + ' ' + val + ';\n';
    }
  }
  indentLevel--;
  // return node string
  return nodeString;
};

_getIndent = function() {
  var i, indent;
  indent = '';
  i = 0;
  while (i < indentLevel) {
    indent += indentChar;
    i++;
  }
  
  // return indent
  return indent;
};