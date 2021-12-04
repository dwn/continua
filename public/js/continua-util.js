function shiftUpFontCode() {
  const el = document.getElementById('font-code');
  el.focus();
  let k = el.selectionEnd;
  let txt = el.value;
  let lineIndex = txt.substring(0,k).split(/\r\n|\r|\n/).length;
  let begin = txt.lastIndexOf('\n',k-1);
  let end = txt.indexOf('\n',k);
  begin = begin<0? 0 : begin;
  end = end<0? txt.length : end;
  let s = txt.substring(begin,end).trim();
  for(let i = 97; i < 97+25; i++) {
    let c0 = String.fromCharCode(i);
    let c1 = String.fromCharCode(i - 5);
    s = s.replace(new RegExp(c0 + "(?![-\|+])", 'g'), c1+'|');
    s = s.replace(new RegExp(c0 + "[-]", 'g'), c1+'+');
    s = s.replace(new RegExp(c0 + "[|]", 'g'), c0);
    s = s.replace(new RegExp(c0 + "[+]", 'g'), c0+'-');
  }
  for(var i=0;i<2;i++) {
    s = s.replace(/\\\+/g, 'u+');
    s = s.replace(/\]\+/g, 'v+');
    s = s.replace(/\^\+/g, 'w+');
    s = s.replace(/\_\+/g, 'x+');
    s = s.replace(/\`\+/g, 'y+');
    s = s.replace(/\\\|/g, 'u|');
    s = s.replace(/\]\|/g, 'v|');
    s = s.replace(/\^\|/g, 'w|');
    s = s.replace(/\_\|/g, 'x|');
    s = s.replace(/\`\|/g, 'y|');
  }
  var arr = txt.split(/\r\n|\r|\n/);
  arr[lineIndex-1] = s;
  el.value = arr.join('\n');
  el.selectionStart = el.selectionEnd = begin + 1;
  el.focus();
  setTimeout(function() {
    el.click();
  }, 200);
  return s;
}
////////////////////////////////////////////
function shiftLeftFontCode() {
  const el = document.getElementById('font-code');
  el.focus();
  let k = el.selectionEnd;
  let txt = el.value;
  let lineIndex = txt.substring(0,k).split(/\r\n|\r|\n/).length;
  let begin = txt.lastIndexOf('\n',k-1);
  let end = txt.indexOf('\n',k);
  begin = begin<0? 0 : begin;
  end = end<0? txt.length : end;
  let s = txt.substring(begin,end).trim();
  for(let i = 97; i < 97+25; i++) {
    const c0 = String.fromCharCode(i);
    const c1 = String.fromCharCode(i - 1);
    s = s.replace(new RegExp(c0 + "(?![-\|+])", 'g'), c1+'-');
    s = s.replace(new RegExp(c0 + "[|]", 'g'), c1+'+');
    s = s.replace(new RegExp(c0 + "[-]", 'g'), c0);
    s = s.replace(new RegExp(c0 + "[+]", 'g'), c0+'|');
  }
  for(let i=0;i<2;i++) {
    s = s.replace(/y\-/g, 'y+');
    s = s.replace(/t\+/g, 'y-');
    s = s.replace(/t\-/g, 't+');
    s = s.replace(/o\+/g, 't-');
    s = s.replace(/o\-/g, 'o+');
    s = s.replace(/j\+/g, 'o-');
    s = s.replace(/j\-/g, 'j+');
    s = s.replace(/e\+/g, 'j-');
    s = s.replace(/e\-/g, 'e+');
    s = s.replace(/\`\+/g, 'e-');
    s = s.replace(/\`\-/g, '`+');
  }
  let arr = txt.split(/\r\n|\r|\n/);
  arr[lineIndex-1] = s;
  el.value = arr.join('\n');
  el.selectionStart = el.selectionEnd = begin + 1;
  el.focus();
  setTimeout(function() {
    el.click();
  }, 200);
  return s;
}
////////////////////////////////////////////
// function imageErode(ctx,canvas,radius=2,threshold=1) {
//   var imgdat = ctx.getImageData(0,0,canvas.width,canvas.height);
//   var pix = imgdat.data;
//   var pix2 = new Array((canvas.width*canvas.height)<<2);
//   for(var y=0; y<canvas.height; y++) {
//     for(var x=0; x<canvas.width; x++) {
//       var i = (canvas.width*(y-2) + x-2)<<2;
//       var s = 0;
//       var q = 0;
//       for(var n=-radius; n<=radius; n++) {
//         for(var m=-radius; m<=radius; m++) {
//           if (x+m<0 || x+m>=canvas.width || y+n<0 || y+n>=canvas.height) { i+=4; continue };
//           if (pix[i+3]>64) s++;
//           i+=4;
//           q++;
//         }
//         i += (canvas.width-5)<<2;
//       }
//       i += (radius - (radius+1)*canvas.width)<<2;
//       s =  (s>=threshold? 0 : 255);
//       pix2[i  ] = s;
//       pix2[i+1] = s;
//       pix2[i+2] = s;
//       pix2[i+3] = 255-s;
//     }
//   }
//   imgdat.data.set(pix2);
//   ctx.putImageData(imgdat,0,0)
// }
////////////////////////////////////////////
function agEllipticArc(ctx,x0,y0,x1,y1,numQuarters,orientation) {
  numQuarters=(numQuarters? numQuarters : 4);
  var tmp;
  var q=[false,false,false,false];
  x0>>=16; x1>>=16; y0>>=16; y1>>=16;
  if (numQuarters&1) {
    if (orientation) { x0-=x1-x0; y1+=y1-y0; }
    else { x1+=x1-x0; y0-=y1-y0; }
    tmp=(((orientation<<1)+(y0>y1))<<1)+(x0>x1);
    q[tmp<4? tmp : 7-tmp]=true;
    if (numQuarters==3) {
      for(var i=0;i<4;i++) {
        q[i]=!q[i];
      }
    }
  }
  else if (numQuarters==2) {
    if (orientation) x0-=x1-x0;
    else y0-=y1-y0;
    tmp=(((orientation<<1)+(y0>y1))<<1)+(x0>x1);
    q[((tmp>1)<<1)-(tmp>3)-(tmp>4? tmp&1 : 0)]=
    q[1+((tmp>1)<<1)-(tmp>4? tmp&1 : 0)]=true;
  }
  else {
    q[0]=q[1]=q[2]=q[3]=true;
  }
  tmp=x0; x0=Math.min(x0,x1); x1=Math.max(tmp,x1);
  tmp=y0; y0=Math.min(y0,y1); y1=Math.max(tmp,y1);
  var cx=(x0+x1)>>1,cy=(y0+y1)>>1,
      rx=(x1-x0)>>1,ry=(y1-y0)>>1;
  if (q[0]) {
    ctx.moveTo(cx,cy+ry);
    ctx.ellipse(cx,cy,rx,ry,0,.5*Math.PI,Math.PI);
  }
  if (q[1]) {
    ctx.moveTo(cx+rx,cy);
    ctx.ellipse(cx,cy,rx,ry,0,0,.5*Math.PI);
  }
  if (q[2]) {
    ctx.moveTo(cx-rx,cy);
    ctx.ellipse(cx,cy,rx,ry,0,Math.PI,1.5*Math.PI);
  }
  if (q[3]) {
    ctx.moveTo(cx,cy-ry);
    ctx.ellipse(cx,cy,rx,ry,0,1.5*Math.PI,2*Math.PI);
  }
}
////////////////////////////////////////////
function agCurve(ctx,pen,x0,y0,x1,y1,curveForm,flipBowlShape) {
  if (pen === 'round') {
    ctx.lineWidth = 25;
    ctx.lineCap = 'round';
  } else if (pen === 'medium') {
    ctx.lineWidth = 13;
    ctx.lineCap = 'round';
  } else {
    ctx.lineWidth = 2;
    ctx.lineCap = 'butt';
  }
  if (x0==x1&&y0==y1) {
    for(var i=-3;i<4;i++) { //Point
      ctx.moveTo((x0>>16)-10-i,499 - ((y0>>16)-10+i));
      ctx.lineTo((x0>>16)+10-i,499 - ((y0>>16)+10+i));
    }
    return;
  }
  if (curveForm<=-1) { //Line
    ctx.moveTo(x0>>16,499 - (y0>>16));
    ctx.lineTo(x1>>16,499 - (y1>>16));
  }
  else {
    var dq;
    if (curveForm<=9) {
      var cx=(x0+x1)>>1;
      var cy=(y0+y1)>>1;
      var dx=(x1-x0)>>1;
      var dy=(y1-y0)>>1;
      var s,t,u,v,p=[];
      dq=(Math.abs(dx)+Math.abs(dy))>>1;
      var dq2=(dy>0? dq : -dq);
      dq=(dx>0? dq : -dq);
      p[0]=-dx;
      p[1]=-dy;
      p[6]=dx;
      p[7]=dy;
      s=t=u=v=0;
      if (curveForm<=0) {
        t=v=dy;
      }
      else if (curveForm<=2) { //Elliptic arc
        var numQuarters=1;
        var orientation=curveForm&1;
        if (x0==x1) {
          if (y0>y1) { var tmp=y0; y0=y1; y1=tmp; } //For GM1 compatibility
          numQuarters=2;
          dq=(y1-y0)>>1;
          dq=(orientation? -dq : dq);
          orientation=true;
          x1+=dq;
        }
        else if (y0==y1) {
          if (x0>x1&&!flipBowlShape) { //For GM1 compatibility
            var tmp=x0; x0=x1; x1=tmp;
          }
          if (!flipBowlShape) { //For GM1 compatibility
            var tmp=x0; x0=x1; x1=tmp;
          }
          if (curveForm==2) {
            var tmp=x0; x0=x1; x1=tmp;
          }
          numQuarters=2;
          dq=(x1-x0)>>1;
          //dq=(orientation? dq : -dq); //Removed for GM1 compatibilty
          orientation=false;
          y1+=dq;
        }
        agEllipticArc(ctx,x0,(499<<16) - y0,x1,(499<<16) - y1,numQuarters,orientation);
        return;
      }
      else {
        if (y0==y1) dq2=-dq2; //For GM1 compatibility
        if (curveForm<=3) { //Bezier curve
          s=dx; u=dq; v=dq2;
        }
        else if (curveForm<=4) {
          t=dy; u=dq; v=dq2;
        }
        else if (curveForm<=5) {
          s=dq; t=dq2; v=dy;
        }
        else if (curveForm<=6) {
          s=dq; t=dq2; u=dx;
        }
        else if (curveForm<=7) {
          s=u=dq; t=v=dq2;
        }
        else if (curveForm<=8) {
          if (Math.abs(dx)<Math.abs(dy)) { dq=-dq; dq2=-dq2; }
          s=u=dq; t=v=-dq2;
        }
        else {
          s=u=dx;
        }
      }
      p[2]=p[0]+s; p[3]=p[1]+t; p[4]=p[6]-u; p[5]=p[7]-v;
      for(var i=0;i<8;i+=2) {
        p[i]+=cx;
        p[i+1]+=cy;
      }
      ctx.moveTo(p[0]>>16,499 - (p[1]>>16));
      ctx.bezierCurveTo(p[2]>>16,499 - (p[3]>>16), p[4]>>16,499 - (p[5]>>16), p[6]>>16,499 - (p[7]>>16));
    }
  }
}
