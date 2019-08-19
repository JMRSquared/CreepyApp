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

Vue.registerElement(
  'Ripple',
   () => require("nativescript-ripple").Ripple
);

Vue.registerElement(
  'CardView',
   () => require("@nstudio/nativescript-cardview").CardView
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
      uniqueID:appSettings.getString("uniqueID"),
      currentPage: 0,
      victims:[]
    }
  },
  mounted(){
    this.victims = this.$store.commit("loadVictims");
  },
  methods:{
    navigate(to, props = null, options = null) {
      if (to == null) {
        if (this.currentPage && this.currentPage > 0 && !props) {
          this.currentPage--;
        } else {
          this.$navigator.back();
        }
      } else {
        options = options || {};
        options.props = props;
        if (this.$navigator.route && this.$navigator.route.path == to) {
          console.log("Going to same page", to);
          return;
        }

        this.$navigator.navigate(to, options);
      }
    },
    addNewVictim(userId,displayName){
      this.$store.commit("addVictim",{
        userId,
        displayName
      });
      this.victims = this.$store.commit("loadVictims");
    }
  }
});

new Vue({
  store,
  render: h => h(App)
}).$start();
