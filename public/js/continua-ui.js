////////////////////////////////////////////
// Dan Nielsen
////////////////////////////////////////////
if (typeof DEBUG!=='undefined' && DEBUG==1) {function debug(s){console.log(s);}} else {function debug(s){}}
////////////////////////////////////////////
function openNotebook() {
  $('#notebook-top-row-container').on('keyup click focus paste', expandTopRow);
  $('#notebook-bottom-row-container').on('keyup click focus paste', expandBottomRow);
  $('#phoneme-map').on('keyup click focus paste', function() { setActiveTextarea('phoneme-map') });
  $('#grapheme-map').on('keyup click focus paste', function() { setActiveTextarea('grapheme-map') });
  $('#conlang-text').on('keyup click focus paste', function() { setActiveTextarea('conlang-text') });
}
function closeNotebook() {
  $('#notebook-top-row-container').off('keyup click focus paste');
  $('#notebook-bottom-row-container').off('keyup click focus paste');
  $('#phoneme-map').off('keyup click focus paste');
  $('#grapheme-map').off('keyup click focus paste');
  $('#conlang-text').off('keyup click focus paste');
}
function setActiveTextarea(id) {
  debug('active: '+id);
  document.getElementById('grapheme-map').classList.remove('active-textarea');
  document.getElementById('phoneme-map').classList.remove('active-textarea');
  document.getElementById('conlang-text').classList.remove('active-textarea');
  document.getElementById('user-text').classList.remove('active-textarea');
  document.getElementById('chat').classList.remove('active-textarea');
  document.getElementById(id).classList.add('active-textarea');
}
function expandTextarea(id) {
  document.getElementById(id).classList.remove('narrow-height');
  document.getElementById(id).classList.add('norm-height');
}
function reduceTextarea(id) {
  document.getElementById(id).classList.remove('norm-height');
  document.getElementById(id).classList.add('narrow-height');
}
function expandBottomRow() {
  reduceTextarea('phoneme-map');
  reduceTextarea('grapheme-map');
  expandTextarea('user-text');
  expandTextarea('conlang-text');
  expandTextarea('chat');
}
function expandTopRow() {
  expandTextarea('phoneme-map');
  expandTextarea('grapheme-map');
  reduceTextarea('user-text');
  reduceTextarea('conlang-text');
  reduceTextarea('chat');
}
////////////////////////////////////////////
  function closeAllSelect(el, skipConfirm = false) {
    debug('closeAllSelect');
    if ($(el).hasClass('select-selected-element') && !$(el).hasClass('select-arrow-active')) {
      debug(el.innerHTML);
      if (el.innerHTML !== 'start') {
        if (!skipConfirm) {
          if (confirm('Are you sure you want to leave this page? Unsaved data will be lost!')) {
            closeNotebook();
            setVisibility('save-needed',false);
            debug('setAllData 4');
            setAllData(false,el,'start');
            setVisibility('settings',true);
            setVisibility('logout',true);
            document.getElementById('page-container').style.background='transparent';
            setVisibility('play',false);
            setVisibility('chat',true);
            const chatEl=document.querySelector('.chat-element');
            if (chatEl) {
              chatEl.classList.remove('third-width');
              chatEl.classList.remove('norm-height');
              chatEl.classList.add('full');
            }
          }
          doNotToggleSelectList=true;
        } else {
          setVisibility('save-needed',false);
          debug('setAllData 5');
          setAllData(false,el,'start');
          setVisibility('settings',true);
          setVisibility('logout',true);
        }
      }
    }
    //A function that will close all select boxes in the document, except the current select box
    var x, y, i, arrNo = [];
    x = document.getElementsByClassName('select-items');
    y = document.getElementsByClassName('select-selected-element');
    for (i = 0; i < y.length; i++) {
      if (el == y[i]) {
        arrNo.push(i)
      } else {
        y[i].classList.remove('select-arrow-active');
      }
    }
    for (i = 0; i < x.length; i++) {
      if (arrNo.indexOf(i)) {
        x[i].classList.add('select-hide');
      }
    }
  }
////////////////////////////////////////////
$(document).ready(function() {
  function customSelectInit() {
    var x, i, j, selElmnt, a, b, c;
    //Look for any elements with the class 'custom-select-element'
    x = document.getElementsByClassName('custom-select-element');
    for (i = 0; i < x.length; i++) {
      selElmnt = x[i].querySelector('select');
      //For each element, create a new DIV that will act as the selected item
      a = document.createElement('DIV');
      a.setAttribute('class', 'select-selected-element');
      a.setAttribute('title', 'language selection'); //*** ADDED ***
      a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
      x[i].appendChild(a);
      //For each element, create a new DIV that will contain the option list
      b = document.createElement('DIV');
      b.setAttribute('class', 'select-items select-hide');
      for (j = 1; j < selElmnt.length; j++) {
        //For each option in the original select element, create a new DIV that will act as an option item
        c = document.createElement('DIV');
        c.innerHTML = selElmnt.options[j].innerHTML;
        c.addEventListener('click', function(e) {
          if ($(this).hasClass('select-selected-element') || $(this).parent().hasClass('select-items')) {
            timeStr = ''; //*** ADDED ***
            debug('setAllData 3 - opening lang from title screen');
            openNotebook();
            setAllData(true,this); //*** ADDED ***
          }
          //When an item is clicked, update the original select box and the selected item
          var y, i, k, s, h;
          s = this.parentNode.parentNode.querySelector('select');
          debug('loadConlangFont 0 - selected lang from main menu');
          loadConlangFont(this.innerHTML + '.otf'); //*** ADDED ***
          h = this.parentNode.previousSibling;
          for (i = 0; i < s.length; i++) {
            if (s.options[i].innerHTML == this.innerHTML) {
              s.selectedIndex = i;
              h.innerHTML = this.innerHTML;
              y = this.parentNode.getElementsByClassName('same-as-selected');
              for (k = 0; k < y.length; k++) {
                y[k].removeAttribute('class');
              }
              this.setAttribute('class', 'same-as-selected');
              break;
            }
          }
          h.click();
        });
        b.appendChild(c);
      }
      x[i].appendChild(b);
      a.addEventListener('click', function(e) {
        //When the select box is clicked, close any other select boxes, and open/close the current select box
        e.stopPropagation();
        closeAllSelect(this);
        if (!doNotToggleSelectList) {
          this.nextSibling.classList.toggle('select-hide');
          this.classList.toggle('select-arrow-active');
        }
        doNotToggleSelectList=false;
      });
    }
  }
////////////////////////////////////////////
  //If the user clicks anywhere outside the select box, then close all select boxes
  document.addEventListener('click', closeAllSelect);
  customSelectInit();
});
