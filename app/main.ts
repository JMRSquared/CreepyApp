import Vue from 'nativescript-vue';
import App from './components/App.vue';
import store from './services/store';
import Notification from './services/notifications';
import Firebase from './services/firebase';

import {
  TNSFontIcon,
  fonticon
} from "nativescript-fonticon"; // require the couchbase module

TNSFontIcon.debug = false;
TNSFontIcon.paths = {
  mdi: "./assets/materialdesignicons.css"
};
TNSFontIcon.loadCss();
Vue.filter("fonticon", fonticon);

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production');

Vue.registerElement(
  'RadSideDrawer',
  () => require('nativescript-ui-sidedrawer').RadSideDrawer
)

// Initialize our main class
// Everything is done on the constructor soo dont stress
const notification = new Notification();
const firebase = new Firebase();
firebase.init();

Vue.mixin({
  data(){
    return {
    }
  },
  mounted(){
    
  },
  methods:{

  }
});

new Vue({
  store,
  render: h => h('frame', [h(App)])
}).$start();
