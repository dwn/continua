function onSuccess(googleUser) {
  console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
  document.getElementByClassName('signin-container-element')[0].style.display = 'none';
  document.getElementsByClassName('custom-select-element')[0].style.display = 'inline-block';
}
function onFailure(error) {
  console.log(error);
}
function renderButton() {
  gapi.signin2.render('signin', {
    'scope': 'profile email',
    'width': 180,
    'height': 75,
    'longtitle': false,
    'theme': 'light',
    'onsuccess': onSuccess,
    'onfailure': onFailure
  });
}
