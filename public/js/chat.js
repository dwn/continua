var bucketURI;
$.ajax({
  type: 'GET',
  url: '/bucket-uri',
  dataType: 'text',
  success: function(res) {
    bucketURI=res;
  },
  error: function(res){
  }
});
////////////////////////////////////////////
$(function () {
  var socket = io();
////////////////////////////////////////////
  $('form').submit(function(){
    if (!$('#m').val()) return false;
    const urlParams = new URLSearchParams(window.location.href);
    const username = urlParams.get('username');
    const  = getParameterByName();
    socket.emit('chat message', username + ':' + $('#m').val());
    $('#m').val('');
    return false;
  });
////////////////////////////////////////////
  socket.on('chat message', function(msg){
    msg = msg.split(':');
    const username = msg[0];
    msg.shift();
    msg = msg.join(':');
    const shortUsername=username.split('_')[2]; //Without uid
    if (shortUsername==='connected') {
      socket.emit('chat font', msg);
    }
    $('#messages').append($("<li style='font" + (shortUsername==='connected'? ': 18px Helvetica, Arial;' : '-family:'+username+';font-size:3em') + "'>").html("<span style='font-family:default'>" + shortUsername + '&nbsp;</span>' + msg));
    window.scrollTo(0, document.body.scrollHeight);
  });
////////////////////////////////////////////
  socket.on('chat font', function(msg){
    console.log(msg);
    msg = msg.split(':');
    const username = msg[0];
    const fontFilename = msg[1];
    const addr = bucketURI + fontFilename;
    var newFont = new FontFace(username, 'url(' + addr + ')');
    newFont.load().then(function(loadedFace) {
      document.fonts.add(loadedFace);
    });
  });
});
