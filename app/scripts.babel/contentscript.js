'use strict';

/**
 * Given an xml string, unescapes xml
 * @param {string} encoded
 * @returns {string}
 */
function decodeXml(encoded) {
  return $('<textarea />').html(encoded).text();
}

function encodeXml(decoded) {
  return $('<textarea />').text(decoded).html();
}

/**
 * If tagName is the tag represented by innerhtml, adds expansion under $line
 *
 * @param {string} innerhtml
 * @return {string} whether there has been a change
 */
function replaceTag(innerhtml) {
  var retval = '';
  var childNodes = $(innerhtml)[0].childNodes;
  console.table(childNodes);
  for (var i = 0; i < childNodes.length; i++) {
    var childNode = childNodes[i];
    if (childNode.nodeType == 3) {
      retval += childNode.wholeText;
    } else {
      var newNode = $(childNode).clone();
      var newNodeText = newNode.text();
      var tempNode = decodeXml(newNodeText);
      newNode.text(tempNode);
      var effectiveNode = $('<div/>').append(newNode).html();
      console.log(effectiveNode);
      retval += effectiveNode;
    }
  }
  return retval;
}

var style = `
    border: rgba(0, 0, 0, 0.27) 2px solid;
    border-radius: 6px;
    width: 750px;
    margin: 10px 60px;
    padding: 10px;
`.replace('\n', ' ').replace('\r', ' ').replace(' +', ' ');

/**
 * Processes a given line
 * @param {object} line
 */
function processLine(line) {
  var innerhtml = $(line).html();
  var tagOnOneLine = decodeXml(innerhtml).match(/<(.+)>.+<\/\1>/);
  if (tagOnOneLine != null) {
    var tagBody = innerhtml.match(/([+\-]? +&lt;.+&gt;)(.+)(&lt;\/.+&gt;)/)[2];
    var updateContent = replaceTag($('<span />').html(tagBody));
    console.log(`After Replace: ${updateContent}`);
    if (updateContent != tagBody) {
      console.log('Has changed!!');
      var html = `<div style="${style}"><span class="blob-code-inner">${updateContent}</span></div>`;
      $(html).insertAfter($(line));
    }
  }
}

/**
 * Processes files with given extension
 * @param {string} extension
 */
function processExtension(extension) {
  $(`.file-header[data-path$="\.${extension}"]`)
      .parents('.file')
      .find('span.blob-code-inner')
      .each((idx, line)=> processLine(line));
}

$(()=> {
  processExtension('ktr');
  processExtension('kjb');
});
