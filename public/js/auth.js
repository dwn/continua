function onSuccess(googleUser) {
  console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
  document.getElementById('signin-container').style.display = 'none';
  document.getElementsByClassName('custom-select-element')[0].style.display = 'inline-block';
}
function onFailure(error) {
  console.log(error);
}
function renderButton() {
  gapi.signin2.render('signin', {
    'scope': 'profile email',
    'width': 150,
    'height': 75,
    'longtitle': false,
    'theme': 'dark',
    'onsuccess': onSuccess,
    'onfailure': onFailure
  });
}
