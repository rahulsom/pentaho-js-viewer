'use strict';

function decodeXml(encoded) {
  return $('<textarea />').html(encoded).text();
}
$(function(){
  console.log('\'Allo \'Allo! Content script');
  $('span.blob-code-inner').each(function(idx, line) {
    var $line = $(line);
    var innerhtml = $line.html();
    var prefix = '';
    if (innerhtml.startsWith('-') || innerhtml.startsWith('+')) {
      prefix = innerhtml[0];
      innerhtml = innerhtml.substring(1);
    }
    innerhtml = innerhtml.trim();
    if (innerhtml.startsWith('&lt;jsScript_script&gt;') && innerhtml.endsWith('&lt;/jsScript_script&gt;')) {
      // decode html once. This is because github escapes html
      innerhtml = decodeXml(innerhtml);
      innerhtml = innerhtml.replace('<jsScript_script>', '').replace('</jsScript_script>', '');
      // decode xml. This is the actual problem introduced by pentaho
      innerhtml = decodeXml(innerhtml);
      var expandedJs = '<hr/>Extracted Javascript<hr/><div><code><pre>' + innerhtml + '</pre></code></div><hr/>';
      var tr = $line.parents('tr');
      $(expandedJs).insertAfter($line);
      console.log(innerhtml);
      $line.append
    } else {
      console.log('Line is OK');
    }
  });
  console.log('Sayonara Content script');
});
