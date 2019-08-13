import Vue from 'nativescript-vue';
import App from './components/App.vue';
import store from './services/store';
import Notification from './services/notifications';
import Firebase from './services/firebase';
import routes from "./services/router";
import Navigator from "nativescript-vue-navigator";
const appSettings = require("tns-core-modules/application-settings");

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
);

Vue.registerElement(
  'Fab',
  () => require('@nstudio/nativescript-floatingactionbutton').Fab
);

// Initialize our main class
// Everything is done on the constructor soo dont stress
if(!appSettings.getString("uniqueID")){
  const GUID = 'xxx-xxx-4x'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
  appSettings.setString("uniqueID",GUID);
}

const firebase = new Firebase();
firebase.init();
const notification = new Notification(firebase);
Vue.use(Navigator, {
  routes
});

Vue.mixin({
  data(){
    return {
      uniqueID:appSettings.getString("uniqueID")
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
