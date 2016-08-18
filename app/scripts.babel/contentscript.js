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
 * @param {jQuery} $line
 * @param {string} tagName
 */
function replaceTag(innerhtml, $line, tagName) {
  if (innerhtml.startsWith(`&lt;${tagName}&gt;`) && innerhtml.endsWith(`&lt;/${tagName}&gt;`)) {
    // decode html once. This is because github escapes html
    innerhtml = decodeXml(innerhtml);
    innerhtml = innerhtml.replace(`<${tagName}>`, '').replace(`</${tagName}>`, '');
    // decode xml. This is the actual problem introduced by pentaho
    innerhtml = decodeXml(innerhtml).replace('\r', '\n');
    console.log(innerhtml);
    var title = `<strong>Extracted ${tagName}</strong>`;
    var body = `<code><pre>${encodeXml(innerhtml)}</pre></code>`;
    var expanded = `<hr/>${title}<hr/><div>${body}</div><hr/>`;
    var tr = $line.parents('tr');
    $(expanded).insertAfter($line);
  }
}

$(()=> {
  console.log('Beginning XML Substitution');
  $('span.blob-code-inner').each((idx, line)=> {
    var $line = $(line);
    var innerhtml = $line.html();
    var prefix = '';
    if (innerhtml.startsWith('-') || innerhtml.startsWith('+')) {
      prefix = innerhtml[0];
      innerhtml = innerhtml.substring(1);
    }
    innerhtml = innerhtml.trim();
    replaceTag(innerhtml, $line, 'jsScript_script');
    replaceTag(innerhtml, $line, 'sql');
    replaceTag(innerhtml, $line, 'note');
  });
  console.log('Done with XML Substitution');
});
