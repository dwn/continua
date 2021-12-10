////////////////////////////////////////////
// Dan Nielsen
////////////////////////////////////////////
if (typeof DEBUG!=='undefined' && DEBUG==1) {function debug(s){console.log(s);}} else {function debug(s){}}
////////////////////////////////////////////
var myUser;
var oldUsername;
$(':checkbox').prop('checked', false); //Makes sure all checkboxes are unchecked on a page reload
function onSuccess(googleUser) { 
  const profile = googleUser.getBasicProfile();
  document.querySelector('.login-container-element').style.display = 'none';
  document.querySelector('.custom-select-element').style.display = 'inline-block';
  document.querySelector('.select-selected-element').innerHTML = 'start';
  let usernameEl = document.getElementsByClassName('username-element')[0];
  oldUsername = profile.getName().toLowerCase().replace(' ','-');
  myUser = { username:oldUsername, id:profile.getId(), email:profile.getEmail(), imageURL:profile.getImageUrl() }
  myUser.id = `g${myUser.id}`;
  myUser.longId = `${myUser.id}_${myUser.username}`;
  usernameEl.value = oldUsername;
  usernameEl.style.display = 'inline-block';
  debug(`auth~myUser.username: ${myUser.username}`);
  debug(`auth~myUser.longId: ${myUser.longId}`);
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
  let auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User logged out');
    document.location.reload();
  });
}
function showLoginOnlyWhenPolicyChecked() {
  let checkboxEl = document.getElementById('policy-checkbox');
  let signinEl = document.getElementById('login');
  signinEl.style.display = (checkboxEl.checked? 'block' : 'none');
}
