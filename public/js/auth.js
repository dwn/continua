$(':checkbox').prop('checked', false); //Makes sure all checkboxes are unchecked on a page reload
function onSuccess(googleUser) {
  var profile = googleUser.getBasicProfile();
  var name = profile.getName();
  var email = profile.getEmail();
  console.log('name: ' + name);
  console.log('email: ' + email);
  // console.log('id: ' + profile.getId());
  // console.log('image url: ' + profile.getImageUrl());
  document.getElementsByClassName('login-container-element')[0].style.display = 'none';
  document.getElementsByClassName('custom-select-element')[0].style.display = 'inline-block';
console.log(name.toLowerCase().replace(' ','-'));
  document.getElementsByClassName('username-element')[0].value = name.toLowerCase().replace(' ','-');

  // document.getElementsByClassName('intro-element')[0].style.display = 'none';
  // document.getElementsByClassName('username-element')[0].style.display = 'block';
  // document.getElementById('username-input').focus();
}
function onFailure(error) {
  console.log(error);
}
function renderButton() {
  gapi.signin2.render('login', {
    'scope': 'profile email',
    'width': 180,
    'height': 75,
    'longtitle': false,
    'theme': 'light',
    'onsuccess': onSuccess,
    'onfailure': onFailure
  });
}
function logout() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User logged out');
    document.location.reload();
  });
}
function showLoginOnlyWhenPolicyChecked() {
  var checkboxEl = document.getElementById('policy-checkbox');
  var signinEl = document.getElementById('login');
  signinEl.style.display = (checkboxEl.checked? 'block' : 'none');
}
