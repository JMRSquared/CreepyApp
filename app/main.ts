import Vue from 'nativescript-vue';
import App from './components/App.vue';
import store from './services/store';
import firebase from './services/firebase';
import routes from "./services/router";
import Navigator from "nativescript-vue-navigator";
import moment from 'moment';
import { SnackBar, SnackBarOptions } from "@nstudio/nativescript-snackbar";
const snackbar = new SnackBar();
var clipboard = require("nativescript-clipboard");
const appSettings = require("tns-core-modules/application-settings");

import {
  TNSFontIcon,
  fonticon
} from "nativescript-fonticon"; // require the couchbase module

import Notification from './services/notifications';
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

Vue.registerElement(
  'MaterialDropdownList',
  () => require("nativescript-materialdropdownlist").MaterialDropdownList
);

Vue.registerElement(
  'MapView',
  () => require('nativescript-google-maps-sdk').MapView
);

Vue.registerElement(
  "MLKitBarcodeScanner",
  () =>
    require("nativescript-plugin-firebase/mlkit/barcodescanning")
      .MLKitBarcodeScanner
);

Vue.use(Navigator, {
  routes
});

Vue.prototype.$firebase = firebase;

Vue.mixin({
  data() {
    return {
      uniqueID: appSettings.getString("uniqueID"),
      currentPage: 0,
      victims: [],
      isLoading: false
    }
  },
  mounted() {
    this.loadVictims();
  },
  methods: {
    loadVictims() {
      store.commit("loadVictims");
      this.victims = store.state.victims;
    },
    getMoment(value = null) {
      return moment(value)
    },
    copyToClipboard(text, successText = "copied to the clipboard") {
      clipboard.setText(text).then(() => {
        this.showSnackBar(successText);
      })
    },
    showSnackBar(msg, actionText = 'ok', duration = 5000, callback = null) {
      const options: SnackBarOptions = {
        actionText: actionText,
        actionTextColor: '#ff6d00',
        snackText: msg,
        textColor: '#c43c00',
        hideDelay: duration,
        backgroundColor: '#fff'
      };

      if (!callback) {
        callback = function (arg) {

        }
      }
      snackbar.action(options).then(callback);
    },
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
    saveNewVictimLocally(userId, displayName) {
      store.commit("addVictim", {
        userId,
        displayName
      });
      this.victims = store.state.victims;
    }
  }
});

new Vue({
  store,
  render: h => h(App)
}).$start();
