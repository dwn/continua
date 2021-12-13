<template lang='pug'>
#menubar
  .heading start
</template>
<!--==============================================-->
<script>
export default {
  name: 'Menubar',
  props: {
    'headings-outer': String,
    'headings-inner': String
  }
}
</script>
<!--==============================================-->
<style lang='scss' scoped>
$menubar-height:5rem;
$menubar-heading-outside-size:2rem;
$menubar-heading-inside-size:1.5rem;
$menubar-heading-color:#fed; //Headings appear in the menubar
$menubar-option-color:ivory; //Options appear in the menubar dropdown
$menubar-bkg-color:#8886;
$menubar-option-bkg-color:#8883;
#menubar {
  position:absolute;
  top:0;
  left:0;
  width:100%;
  height:$menubar-height;
  line-height:$menubar-height;
  font-size:$menubar-heading-outside-size;
  background-color:$menubar-bkg-color;
  box-shadow:$box-shadow-down;
  text-shadow:$text-outline;
  cursor:pointer;
}
.heading {
  padding:0 3rem 0 3rem;
  transition:all .2s ease-out;
  &:hover {
    box-shadow:$box-highlight-inset;
    text-shadow:$text-outline,$text-highlight;
  }
}
</style>
