import Vue from 'nativescript-vue';
import App from './components/App.vue';
import store from './store';
import Notification from './services/notifications';

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production');

Vue.registerElement(
  'RadSideDrawer',
  () => require('nativescript-ui-sidedrawer').RadSideDrawer
)

// Initialize our main class
// Everything is done on the constructor soo dont stress
const notification = new Notification();

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
