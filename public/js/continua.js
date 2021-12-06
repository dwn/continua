////////////////////////////////////////////
// Dan Nielsen
////////////////////////////////////////////
if (typeof DEBUG!=='undefined' && DEBUG==1) {function debug(s){console.log(s);}} else {function debug(s){}}
////////////////////////////////////////////
$(document).ready(function() {
  document.getElementById('page-container').style.background='transparent'; //In case background state was cached
////////////////////////////////////////////
  $(window).on('keydown', function(event) {
    if (event.ctrlKey || event.metaKey) {
      switch(String.fromCharCode(event.which).toLowerCase()) {
      case 's': //CTRL-S
        event.preventDefault();
        setVisibility("save-needed",false);
        downloadSVGAndOTF();
        break;
      case 'g': //CTRL-G
        event.preventDefault();
        closeAllSelect(document.querySelector('.select-selected-element'));
      }
    }
  });
////////////////////////////////////////////
  $('#user-text').on('keyup click focus paste', function() {
    setActiveTextarea('user-text');
    var txtEl = document.getElementById('user-text');
    var sel = getSelectedText();
    if (sel !== '') return; //Do not process if any highlighted text
    txt = txtEl.value;
    fullTxt = txt;
    debug(fullTxt);
    var conlangTextEl = document.getElementById('conlang-text');
    grProcess();
    if (!conlangTextReady) return; //Keep 'loading' showing unless ready
    conlangTextEl.innerText = txt;
    conlangTextEl.innerHTML = conlangTextEl.innerText.replace(/⟨/g,"<span style='font-family:arial;font-size:.5em'>").replace(/⟩/g,'</span>');
    //Scroll conlang text to center
    var hDiv,hScroll;
    var len = fullTxt.length;
    var valDirect = json['direction'];
    if (valDirect==='right-down' || valDirect==='left-down') {
      hDiv = conlangTextEl.offsetHeight;
      hScroll = conlangTextEl.scrollHeight;
    } else if (valDirect==='down-right' || valDirect==='down-left') {
      hDiv = conlangTextEl.offsetWidth;
      hScroll = conlangTextEl.scrollWidth;
    }
    var pos = txtEl.selectionStart;
    if (json['view'] === 'view single page') { pos = 0; } //If single-page-only view, then go to beginning
    var h = ((hScroll*pos) / len) - .5 * hDiv;
    if (valDirect==='right-down' || valDirect==='left-down') {
      conlangTextEl.scrollTop = h;
    } else {
      if (valDirect==='down-right') {
        conlangTextEl.scrollLeft = h;
      } else if (valDirect==='down-left') {
        conlangTextEl.scrollLeft = -h;
      }
    }
  });
////////////////////////////////////////////
  $('#font-code').on('change', function() {
    setVisibility('save-needed',true);
  });
////////////////////////////////////////////
  $('#font-code').on('keyup click focus paste', function() {
    if (alreadyProcessingLine) return;
    alreadyProcessingLine = true;
    var k = this.selectionEnd;
    var txt = this.value;
    var begin = txt.lastIndexOf('\n',k-1);
    var end = txt.indexOf('\n',k);
    var lineIndex = txt.substring(0,k).split(/\r\n|\r|\n/).length;
    begin = begin<0? 0 : begin;
    end = end<0? txt.length : end;
    var str = txt.substring(begin,end).trim();
    var xAdvance = 0;
    var xExtra = 0;
    var yExtra = 0;
    var numHoles=0;
    var numLastPaths=0;
    while(str[0]==='-' || str[0]==='+' || str[0]==='|' || str[0]==='>' || str[0]==='^' || str[0]==='@' || str[0]==='*') {
      if (str[0]==='-') xAdvance += 13;
      else if (str[0]==='|') xAdvance += 78;
      else if (str[0]==='+') xAdvance += 156;
      else if (str[0]==='>') xExtra += 35;
      else if (str[0]==='^') yExtra += 35;
      else if (str[0]==='@') numHoles++;
      else if (str[0]==='*') numLastPaths++;
      str = str.substring(1,str.length);
    }
    var canvas = document.getElementById('font-canvas'),
    ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var k0,x0,y0,c,k1,x1,y1;
    for(var i=1;i<str.length;i++) {
      var c0,c1,c2,xoOffset=0,yoOffset=0,xfOffset=0,yfOffset=0;
      c1 = str.charCodeAt(i) - 48; //Digit or slash
      if (c1 >= -1 && c1 <= 9) {
        c0 = str.charCodeAt(i-1) - 97;
        if (c0 == -52 || c0 == -54 || c0 == 27) { //- + |
          if (c0 == -54 || c0 == -52) {
            xoOffset=50;
          }
          if (c0 == -54 || c0 == 27) {
            yoOffset=50;
          }
          if (i-2>=0) {
            c0 = str.charCodeAt(i-2) - 97;
          } else continue;
        }
        if (i+1<str.length) {
          c2 = str.charCodeAt(i+1) - 97;
          if (i+2<str.length) {
            c3 = str.charCodeAt(i+2) - 97;
            if (c3 == -52 || c3 == -54 || c3 == 27) { //- + |
              if (c3 == -54 || c3 == -52) {
                xfOffset=50;
              }
              if (c3 == -54 || c3 == 27) {
                yfOffset=50;
              }
            }
          }
          if (c0 >= -4 && c0 <= 25 && c2 >= -4 && c2 <= 25) {
            if (c0 < 0) c0 += 30;
            if (c2 < 0) c2 += 30;
            xo = 25 + 100 * (c0 % 5);
            yo = 25 + 100 * Math.floor(c0 / 5);
            xf = 25 + 100 * (c2 % 5);
            yf = 25 + 100 * Math.floor(c2 / 5);
            var r;
            if (json['pen'] === 'round') {
              r = 5;
            } else if (json['pen'] === 'medium') {
              r = 11;
            } else {
              r = 16;
            }
            for(var j=-r;j<=r;j++) {
              agCurve(ctx,json['pen'],(xo+j+xoOffset)<<16,(yo-j+yoOffset)<<16,(xf+j+xfOffset)<<16,(yf-j+yfOffset)<<16,c1,false);
            }
          }
        }
      }
    }
    ctx.stroke();
    setTimeout(function() { getSVG(ctx,canvas,lineIndex,xAdvance,xExtra,yExtra,numHoles,numLastPaths); alreadyProcessingLine = false; }, 100);
  });
});
////////////////////////////////////////////
var speakId;
var kerning;
var otfURI;
var timeStr = '';
var doNotToggleSelectList=false;
var alreadyProcessingLine=false;
json['font'] = {};
json['direction'] = 'right-down';
json['pen'] = 'medium';
json['weight'] = 'bold';
json['size'] = 'small';
json['style'] = 'plain';
json['space'] = '.5';
json['note'] = '';
json['view'] = 'view single page';
////////////////////////////////////////////
function setVisibility(name, on) {
  var arrEl = document.getElementsByClassName(name+'-element');
  for(var i=0;i<arrEl.length;i++) {
    var el = arrEl[i];
    if (on) {
      if (name === 'title-container') {
        el.style.display = 'block'; //Title has centering rule
      }
      if (name === 'username') {
        document.querySelector('.select-selected-element').classList.remove('small-menu-title');
      }
      else el.style.display = 'inline-block';
      if (name === 'font') {
        document.getElementById('font-code').focus(); //Refresh glyph preview if font screen
      }
    } else {
      el.style.display = 'none';
      if (name === 'username') {
        document.querySelector('.select-selected-element').classList.add('small-menu-title');
      }
    }
  }
}
////////////////////////////////////////////
function hideAll() {
  setVisibility('font',false);
  setVisibility('adjust',false);
  setVisibility('notebook',false);
  setVisibility('title-container',false);
  setVisibility('settings',false);
  setVisibility('logout',false);
  document.getElementById('page-container').style.background='url(/img/bkg/upholstry.png)';
}
////////////////////////////////////////////
function setPen() {
  var txtEl = document.getElementById('font-code');
  var penProgressEl = document.querySelector('.pen-progress-element');
  penProgressEl.value = 0;
  var txt = txtEl.value;
  var arr = txt.split(/\r?\n/g);
  var sum = 0;
  setVisibility('pen-progress',true);
  function start(counter){
    if (counter < arr.length){
      setTimeout(function() {
        txtEl.selectionStart = txtEl.selectionEnd = sum;
        txtEl.focus();
        txtEl.click();
        debug(sum.toString());
        sum += arr[counter].length+1;
        counter++;
        penProgressEl.value = (100*counter) / arr.length;
        start(counter);
      }, 350);
    } else {
      setVisibility('pen-progress',false);
    }
  }
  start(0);
}
////////////////////////////////////////////
function setAdjustSetting() {
  var el = document.getElementById('conlang-text');
  el.style.textOrientation = 'upright';
  var valDirect = document.getElementById('direction').value;
  json['direction'] = valDirect;
  if (valDirect=='right-down') {
    el.style.writingMode = 'horizontal-tb';
  } else if (valDirect==='left-down') {
    el.style.writingMode = null;
  } else if (valDirect==='down-right') {
    el.style.writingMode = 'vertical-lr';
  } else if (valDirect==='down-left') {
    el.style.writingMode = 'vertical-rl';
  }
  json['pen'] = document.getElementById('pen').value;
  json['weight'] = document.getElementById('weight').value;
  json['size'] = document.getElementById('size').value;
  json['style'] = document.getElementById('style').value;
  json['space'] = document.getElementById('space').value;
  json['note'] = document.getElementById('note').value;
  json['view'] = document.getElementById('view').value;
  json['name'] = timeStr+document.getElementById('font-name').value;
  document.querySelector('.select-selected-element').innerText = json['name'];
  el.style.fontWeight = (json['weight'] === 'bold'? 600 : 200);
  el.style.fontSize = (json['size'] === 'small'? '1.54rem' : '3.08rem');
  el.style.backgroundBlendMode = 'null'; //Firefox hack - sometimes background blend mode requires null first in order to update
  Object.assign(el.style,style[json['style']]);
  if (json['view']==='view full text') {
    alert('Processing long, complex texts all at once can stall performance - consider viewing only the current page instead');
  }
}
////////////////////////////////////////////
function getSVG(ctx,canvas,lineIndex,xAdvance,xExtra,yExtra,numHoles,numLastPaths) {
  var fontSVGContainer = document.getElementById('font-svg-container');
  while (fontSVGContainer.firstChild) {
    fontSVGContainer.removeChild(fontSVGContainer.firstChild);
  }
  var imgdat = ctx.getImageData(0,0,canvas.width,canvas.height);
  var svgstr = ImageTracer.imagedataToSVG(imgdat,'posterized2');
  var letterIndex = 32 + lineIndex;
  var letter = '&#x' + letterIndex.toString(16) + ';';
  if (letter === '&#x2b;' || letter === '&#x2d;' || letter === '&#x5c;' || letter === '&#x5f;' || letter === '&#x7c;' || letter === '&#xad;' || letterIndex < 0x20 || (letterIndex >= 0x7f && letterIndex <= 0xa0)) {
    document.getElementById('font-svg-container').insertAdjacentHTML('beforeend', '<br>(reserved)');
    return;
  }
  parser = new DOMParser();
  xml = parser.parseFromString(svgstr,'text/xml');
  arrPath = xml.getElementsByTagName('path');  
  var arrStr='';
  for(var i=0; i<arrPath.length; i++) {
    arrStr+=arrPath[i].getAttribute('d');
  }
  arrStr=arrStr.replace(/M 0 0 L 175 0 L 175 175 L 0 175 L 0 0 Z/g,'').replace(/ Z /g,'');
  arrStr=arrStr.trim();
  arrStr=arrStr.split('M ').filter(function(el) {return el.length != 0});
  var svgGlyph = '';
  for(var i=0; i<arrStr.length; i++) {
    if (i<=numHoles || i>=arrStr.length-numLastPaths) svgGlyph += " M "+arrStr[i];
  }
  if (svgGlyph.trim() === "") {
   document.getElementById('font-svg-container').insertAdjacentHTML('beforeend', '<br>'+letter);
   if (letter in json['font']) {
     delete json['font'][letter];
   }
  }
  else {
    json['font'][letter] = {};
    json['font'][letter]['code'] = svgGlyph;
    json['font'][letter]['spacing'] = xAdvance;
    json['font'][letter]['raising'] = yExtra;
    json['font'][letter]['rightening'] = xExtra;
    svgstr = '<svg id="svg-preview" fill="gray" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://web.resource.org/cc/" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:svg="http://www.w3.org/2000/svg" version="1.0" width="175" height="175"><path d="' + svgGlyph + '"/></svg>';
    document.getElementById('font-svg-container').insertAdjacentHTML('beforeend', "<table><tr><td width='160px'>"+svgstr+"</td><td>"+letter+"<br><span id='up-arrow' style='cursor:pointer'>&#x1f839;</span><br><span id='left-arrow' style='cursor:pointer'>&#x1f838;</span></td></tr></table>");
    document.getElementById('up-arrow').onclick = function() { shiftUpFontCode() };
    document.getElementById('left-arrow').onclick = function() { shiftLeftFontCode() };
  }
}
////////////////////////////////////////////
function loadClientFile(evt) {
  debug('loadClientFile');
  //Client opened SVG file from own computer, so load it and save it to the cloud
  var files = evt.target.files;
  for (var i = 0, f; f = files[i]; i++) {
    if (f.type!=='image/svg+xml') {
      continue;
    }
    json['name'] = f.name.split('.').slice(0,-1).join('.');
    timeStr = json['name'].match(/\d{4}[-]\d{2}[-]\d{2}[_]\d{2}[_]\d{2}[_]\d{2}[_]\d{3}[_]/);
    if (!timeStr) {
      alert('File failed to load - filename missing timestamp');
      return true;
    }
    setVisibility('menu',false);
    setVisibility('select-selected',false);
    setVisibility('conlang-loading',true);
    var reader = new FileReader();
    reader.onload = (function(theFile) {
      return function(e) {
        var res = e.target.result;
        var el = document.querySelector('.select-selected-element');
        if (theFile.type==='image/svg+xml') {
          json['font'] = {};
          $.ajax({
            type: 'POST',
            url: '/upload-file-to-cloud',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8',
            data: res,
            success: function(result) {
              debug('setAllData 1');
              setAllData(true, el, title = json['name'], res);
              loadConlangFont('currentFont'+timeStr,json['name']+'.otf');
              setVisibility('conlang-loading',false);
            },
            error: function(result){
              debug(result);
            }
          });
        }
      };
    })(f);
    if (f.type==='image/svg+xml') reader.readAsText(f);
    else reader.readAsDataURL(f);
  }
}
////////////////////////////////////////////
function download(filename, blob) {
  debug('download');
  if (window.navigator.msSaveOrOpenBlob) { //IE10+
    window.navigator.msSaveOrOpenBlob(blob, filename);
  } else { //Others
    var a = document.createElement('a'), url = URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
////////////////////////////////////////////
function downloadSVGAndOTF() {
  debug('downloadSVG');
  consoleEl = document.getElementById('console');
  consoleEl.value += 'Saving ∼ please wait ten seconds\n';
  consoleEl.scrollTop = consoleEl.scrollHeight;
  //Construct SVG data
  const scale = 12;
  timeStr = (new Date()).toISOString().replace(/[A-Za-z.:]/g,"_");
  json['name'] = timeStr+json['name'].replace(/\d{4}[-]\d{2}[-]\d{2}[_]\d{2}[_]\d{2}[_]\d{2}[_]\d{3}[_]/g, '');
  json['user-text'] = fullTxt.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  json['font-code'] = document.getElementById('font-code').value;
  if (invalidCharacterCombo()) return;
  var lastASCIIValueInFontCode = 33 + (json['font-code'].match(/\n/g) || []).length;
  var cat = svgFontTemplate;
  var dic = json['font'];
  for(var glyphUnicode in dic) {
    var glyphName = replacement[glyphUnicode]['glyph-name'];
    var res = '';
    var yExtra = json['font'][glyphUnicode]['raising'] * scale;
    if (yExtra || scale != 1) {
      var code = json['font'][glyphUnicode]['code'];
      code = code.split(" ").filter(function(el) {return el.length != 0});
      var isYCoord = false;
      for(var i=0; i<code.length; i++) {
        if (!isNaN(code[i])) { //Is integer
          if (isYCoord) {
            var integer = parseInt(code[i], 10);
            integer *= scale;
            integer += yExtra;
            code[i] = integer.toString();
          }
          isYCoord=!isYCoord;
        }
        res += code[i] + ' ';
      }
    }
    else {
      res = json['font'][glyphUnicode]['code'];
    }
    res2 = '';
    var xExtra = json['font'][glyphUnicode]['rightening'] * scale;
    if (xExtra || scale != 1) {
      var code = res;
      code = code.split(" ").filter(function(el) {return el.length != 0});
      var isXCoord = true;
      for(var i=0; i<code.length; i++) {
        if (!isNaN(code[i])) { //Is integer
          if (isXCoord) {
            var integer = parseInt(code[i], 10);
            integer *= scale;
            integer += xExtra;
            code[i] = integer.toString();
          }
          isXCoord=!isXCoord;
        }
        res2 += code[i] + ' ';
      }
    }
    else {
      res2 = res;
    }
    cat += String.raw`<glyph glyph-name="` + glyphName + String.raw`" unicode="` + glyphUnicode + String.raw`" horiz-adv-x="` + json["font"][glyphUnicode]['spacing'] * scale + String.raw`" d="` + res2 + String.raw`"/>`+'\n';
  }
  //If vertical font, change horizontal advance to vertical
  var valDirect = document.getElementById('direction').value;
  if (valDirect==='down-right' || valDirect==='down-left') {
    cat = cat.replace(/horiz-adv-x/g,'vert-adv-y');
  }
  //Add default characters that were not overwritten
  for(var glyphUnicode in replacement) {
    if (!(glyphUnicode in dic)) {
      var glyph = replacement[glyphUnicode];
      cat += String.raw`<glyph glyph-name="` + glyph['glyph-name'] + String.raw`" unicode="` + glyphUnicode + String.raw`" horiz-adv-x="` + glyph['horiz-adv-x'] + String.raw`" vert-adv-y="` + glyph['vert-adv-y'] + String.raw`" d="` + glyph['d'] + String.raw`"/>`+'\n';
    }
  }
  //Add kerning
  for(var k in kerning) {
    var lhs0 = parseInt('0x'+kerning[k]['lhs0']);
    var rhs0 = parseInt('0x'+kerning[k]['rhs0']);
    var lhs1 = parseInt('0x'+kerning[k]['lhs1']);
    var rhs1 = parseInt('0x'+kerning[k]['rhs1']);
    if (isNaN(lhs0) || isNaN(lhs1)) continue;
    if (isNaN(rhs0)) rhs0=lhs0;
    if (isNaN(rhs1)) rhs1=lhs1;
    if (lhs0<0x20 || lhs0>0xff || rhs0<0x20 || rhs0>0xff || lhs0>rhs0 || lhs1<0x20 || lhs1>0xff || rhs1<0x20 || rhs1>0xff || lhs1>rhs1) {
      continue;
    }
    var u1 = [];
    for(var u = lhs0; u <= rhs0; u++) {
      u1.push('&#x'+u.toString(16)+';');
    }
    u1 = u1.join(',');
    var u2 = [];
    for(var u = lhs1; u <= rhs1; u++) {
      u2.push('&#x'+u.toString(16)+';');
    }
    u2 = u2.join(',');
    cat += String.raw`<hkern u1="` + u1 + `" u2="` + u2 + `" k="` + 187.2 * kerning[k]['numShiftLeft'] + `"/>`+'\n';
  }
  var valSpace = Number(document.getElementById('space').value);
  cat += `
<glyph glyph-name="space" unicode="&#x20;" horiz-adv-x="[[XSPACE]]" vert-adv-y="[[YSPACE]]" />
<glyph glyph-name="plus" unicode="&#x2b;" horiz-adv-x="1872" vert-adv-y="2808" />
<glyph glyph-name="hyphenminus" unicode="&#x2d;" horiz-adv-x="187.2" vert-adv-y="280.2" />
<glyph glyph-name="vbar" unicode="&#x7c;" horiz-adv-x="936" vert-adv-y="1404" />
<glyph glyph-name="nbsp" unicode="&#xa0;" horiz-adv-x="[[XSPACE]]" vert-adv-y="[[YSPACE]]" />
</font></defs></svg>`.replace(/\[\[XSPACE\]\]/g,1872 * valSpace).replace(/\[\[YSPACE\]\]/g, 1872 * valSpace);
  //If vertical font, change horizontal kerning to vertical
  if (valDirect==='down-right' || valDirect==='down-left') {
    cat = cat.replace(/<hkern/g,'<vkern');
  }
  //XML safeguarding
  json['font-code']=json['font-code'].replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  //Place XML in SVG description tag
  var jsonStr = JSON.stringify(json,null,' ');
  cat = cat.replace(/\[\[EMBEDJSON\]\]/g,jsonStr);
  cat = cat.replace(/\[\[NAME\]\]/g,json['name'].replace(/\d{4}[-]\d{2}[-]\d{2}[_]\d{2}[_]\d{2}[_]\d{2}[_]\d{3}[_]/g, ''));
  //File data
  var blob = new Blob([cat], {type: 'image/svg+xml'});
  download(json['name']+'.svg', blob);
  //Reload font data - will be saved to cloud and converted to OTF
  var el = document.querySelector('.select-selected-element');
  json['font'] = {};
  setVisibility('menu',false);
  setVisibility('select-selected',false);
  setVisibility('conlang-loading',true);
  debug('/upload-file-to-cloud');
  $.ajax({
    type: 'POST',
    url: '/upload-file-to-cloud',
    dataType: 'json',
    contentType: 'application/json;charset=utf-8',
    data: cat,
    success: function(result) {
      document.getElementById('console').value = '';
      debug('setAllData 2');
      setAllData(true, el, title = json['name'], cat);
      loadConlangFont('currentFont'+timeStr,json['name']+'.otf');
      setVisibility('conlang-loading',false);
      setVisibility('select-selected',true);
      debug('downloading OTF');
      fetch(otfURI)
      .then(res => res.blob())
      .then(blob => {
        download(json['name']+'.otf', blob);
      });
    },
    error: function(result){
      debug(result);
    }
  });
}
////////////////////////////////////////////
function openChat() {
  debug('openChat');
  setVisibility('chat',false);
  setVisibility('chat',true);
  const chatEl=document.querySelector('.chat-element');
  if (chatEl) {
    chatEl.classList.remove('full');
    chatEl.classList.add('third-width');
    chatEl.classList.add('norm-height');
    let menuTitleEl = document.querySelector('.select-selected-element');
    myUser.lang = menuTitleEl.innerHTML;
    debug(`myUser.lang:${myUser.lang}`);
    $.ajax({async:false,
      type:'GET',
      dataType:'text',
      url:`/chat/longId/${myUser.longId}/lang/${myUser.lang}`,
      success:function(r){},
      error:function(r){}})
  }
}
////////////////////////////////////////////
// CALLED BY CUSTOM SELECT DROPDOWN
////////////////////////////////////////////
function loadTryForever(font) {
  return font.load().catch(function(err) { 
    setTimeout(function() {
      debug('FAILED TO LOAD FONT\nTrying again');
      return loadTryForever(font); 
    }, 1000);
  });
}
function loadConlangFont(family, langFilename) {
  debug('loadConlangFont');
  conlangTextReady = false;
  var tmp = document.getElementById('conlang-text').value;
  document.getElementById('conlang-text').innerHTML = "<img src='img/icon/progress.gif'></img>";
  setVisibility('play',false);
  //Get lang file URL
  let langFileURL; $.ajax({async:false,type:'GET',dataType:'text',url:`/lang-file-url/${langFilename}`,success:function(r){langFileURL=r;},error:function(r){}});
  //OTF file location for later download
  if (langFilename.split('.').pop()==='otf') otfURI = langFileURL;
  //Load font
  var newFont = new FontFace(family, 'url(' + langFileURL + ')');
  loadTryForever(newFont).then(function(loadedFace) {
    setTimeout(function() { //Occasionally even after the font was successfully loaded, it needs a brief moment before adding
      document.fonts.add(loadedFace);
    }, 1000);
    const conlangTextEl = document.getElementById('conlang-text');
    conlangTextEl.style.fontFamily = family;
    conlangTextEl.innerText = tmp;
    conlangTextReady = true;
    //Select first page
    var el = document.getElementById('user-text');
    if (el) {
      openChat();
      var end = fullTxt.indexOf('{br}',0);
      if (end<0 || end>20000) { //Show single page if no break or long preface
        end = nthIndex(fullTxt,'\n',0,22);
        end = end<0? fullTxt.length : end;
      }
      el.focus();
      el.setSelectionRange(0,end);
      txt = fullTxt.substring(0,end);
      el.scrollTop = 0;
    }
    //Show play element
    if (document.querySelector('.select-selected-element').innerHTML!=='start') {
      setVisibility('play',true);
    }
  });
}
////////////////////////////////////////////
//Load file when file opened
document.getElementById('files').addEventListener('change', loadClientFile, false);
//Disable enter key for form submission of username
document.querySelector('.username-element').addEventListener('keydown', e => {
  if (event.keyCode == 13) { event.preventDefault(); return false; }
});
//Set username on username input blur
document.querySelector('.username-element').addEventListener('blur', e => {
  if (!/^[a-z0-9.-]+$/.test(e.target.value)) {
    e.target.value = oldUsername;
    alert('Sorry, only the following are allowed in a username ∼ \n\n🙞 lowercase English letters (a-z)\n🙞 digits (0-9)\n🙞 period (.)\n🙞 hyphen (-)');
  } else {
    myUser.username = e.target.value;
    myUser.longId = `g${myUser.id}_${myUser.username}`;
    debug(`blur-username~myUser.username: ${myUser.username}`);
    debug(`blur-username~myUser.longId: ${myUser.longId}`);
  }
});
