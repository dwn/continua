////////////////////////////////////////////
// Dan Nielsen
////////////////////////////////////////////
//Requires jquery
$(function(){
////////////////////////////////////////////
// Basic
////////////////////////////////////////////
  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    var results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
////////////////////////////////////////////
// Chat
////////////////////////////////////////////
  var socket = io();
  var uniqueUsername = getParameterByName('username');
////////////////////////////////////////////
  $('form').submit(function(){
    if (!$('#messages-input').val()) return false;
    socket.emit('chat message', uniqueUsername + ':' + $('#messages-input').val());
    $('#messages-input').val('');
    $('#messages-input').focus();
    return false; //Non-refreshing submit
  });
////////////////////////////////////////////
  socket.on('chat message', function(msg){
    msg = msg.split(':');
    var username = msg[0];
    msg.shift();
    msg = msg.join(':');
    if (msg.substr(0,12)=='[[username]]') { //Possible to set a new username with [[username]]
      username=uniqueUsername=msg.substr(12);
    }
    const shortUsername=username.split('_')[2]; //Without uid
    if (shortUsername==='connected') {
      socket.emit('chat font', msg);
    }
    $('#messages')
    .append($("<li "+
      (shortUsername==='connected'?
        "style='font:18px Helvetica,Arial'" :
        (username? "style='font-family:"+username+"'" : '')
      ) + ">")
    //Specific to this app
    .html("<span style='font-family:default'>"+
      shortUsername+'&nbsp;</span>' + msg));
    window.scrollTo(0, document.body.scrollHeight);
  });
////////////////////////////////////////////
  socket.on('chat font', function(msg){
    console.log(msg);
    msg = msg.split(':');
    const username = msg[0];
    const fontFilename = msg[1];
    //Ajax bucket-uri/ -> bucketURI
    $.ajax({type:'GET',dataType:'text',url:'/bucket-uri',
      success:function(bucketURI){
        const addr = bucketURI + fontFilename;
        var newFont = new FontFace(username, 'url(' + addr + ')');
        newFont.load().then(function(loadedFace) {
          document.fonts.add(loadedFace);
        });
      },error:function(r){}
    }); //bucketURI
  });
});
