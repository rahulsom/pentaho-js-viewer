function input(inputStr) {
  return `<span class="blob-code-inner">${inputStr}</span>`
}
function output(outputStr) {
  var wrap1 = input(outputStr);
  return `<div style="${style}">${wrap1}</div>`
}
(function () {
  'use strict';

  describe("Content Script's processLine method works", function () {

    it('Simple normalization works', ()=>{
      var home = $('<div/>');
      var line = $(input('+      &lt;name&gt;Update&amp;#x2f;Fix SERVICE_DATE for Professional Claim&lt;/name&gt;'));
      home.append(line);
      processLine(line[0]);
      var op = input('+      &lt;name&gt;Update&amp;#x2f;Fix SERVICE_DATE for Professional Claim&lt;/name&gt;') +
          output('Update/Fix SERVICE_DATE for Professional Claim');
      expect(home.html()).to.equal(op);
    });

    it('Nested normalization works', ()=>{
      var home = $('<div/>');
      var line = $(input('+        &lt;path&gt;&amp;#x24;.contained&amp;#x5b;&amp;#x3f;&amp;#x28;&amp;#x40;.resourceType&amp;#x3d;&amp;#x3d;&amp;#x27;Location&amp;#x27;&amp;#x29;&amp;#x5d;<span class="x x-first x-last">&amp;#x5b;0&amp;#x5d;</span>.name&lt;/path&gt;'));
      home.append(line);
      processLine(line[0]);
      var op = input('+        &lt;path&gt;&amp;#x24;.contained&amp;#x5b;&amp;#x3f;&amp;#x28;&amp;#x40;.resourceType&amp;#x3d;&amp;#x3d;&amp;#x27;Location&amp;#x27;&amp;#x29;&amp;#x5d;<span class="x x-first x-last">&amp;#x5b;0&amp;#x5d;</span>.name&lt;/path&gt;') +
          output(`$.contained[?(@.resourceType=='Location')]<span class="x x-first x-last">[0]</span>.name`);
      expect(home.html()).to.equal(op);
    });

    it('Normalization works when there are angular brackets in the text', ()=>{
      var home = $('<div/>');
      var line = $(input('       &lt;note&gt;Change Log&amp;#xa;&amp;#x3d;&amp;#x3d;&amp;#x3d;&amp;#x3d;&amp;#x3d;&amp;#x3d;&amp;#x3d;&amp;#x3d;&amp;#xa;&amp;#x3c;Date&amp;#x3e;-&amp;#x3c;Developer&amp;#x3e;-&amp;#x3c;Change Description&amp;#x3e;&amp;#xa;06&amp;#x2f;24&amp;#x2f;2015 - Kremer - EDI_INTRA_ELEMENT_SEPARATOR property added.  Input EDI file shall be parsed by process-edi-import.sh to determine seperator.  kettle.properties no longer used.&lt;/note&gt;'));
      home.append(line);
      processLine(line[0]);
      var op = input('       &lt;note&gt;Change Log&amp;#xa;&amp;#x3d;&amp;#x3d;&amp;#x3d;&amp;#x3d;&amp;#x3d;&amp;#x3d;&amp;#x3d;&amp;#x3d;&amp;#xa;&amp;#x3c;Date&amp;#x3e;-&amp;#x3c;Developer&amp;#x3e;-&amp;#x3c;Change Description&amp;#x3e;&amp;#xa;06&amp;#x2f;24&amp;#x2f;2015 - Kremer - EDI_INTRA_ELEMENT_SEPARATOR property added.  Input EDI file shall be parsed by process-edi-import.sh to determine seperator.  kettle.properties no longer used.&lt;/note&gt;') +
          output(`Change Log
========
&lt;Date&gt;-&lt;Developer&gt;-&lt;Change Description&gt;
06/24/2015 - Kremer - EDI_INTRA_ELEMENT_SEPARATOR property added.  Input EDI file shall be parsed by process-edi-import.sh to determine seperator.  kettle.properties no longer used.`);
      expect(home.html()).to.equal(op);
    });

  });
})();
