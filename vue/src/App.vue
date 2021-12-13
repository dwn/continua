<template lang='pug'>
TitleScreen(title='comntiua--' motto='🙞 a web app for language construction 🙜')
Menubar
</template>
<!--==============================================-->
<script>
import TitleScreen from './components/TitleScreen.vue'
import Menubar from './components/Menubar.vue'
export default {
  name:'App',
  components: {
    TitleScreen,
    Menubar
  }
}
</script>
<!--==============================================-->
<style lang='scss'>
@import url($font-url);
html, body, #app { padding:0; margin:0; width:100vw; min-height:100vh; overflow:hidden; }
#app {
  font-family:$font;
  font-size:$font-size;
  text-align:center;
  color:$color;
}
</style>
