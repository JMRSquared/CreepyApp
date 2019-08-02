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

const notification = new Notification();
let hasPermission = false;
if(!notification.hasPermission()){
  notification.requestPermission().then((allowed:boolean) => {
    hasPermission = allowed;
    if(!allowed){
      console.log("He denied access!");
    }
  });
}

Vue.mixin({
  data(){
    return {
      hasPermission:hasPermission
    }
  },
  mounted(){
    this.hasPermission = hasPermission;
  },
  methods:{

  }
});

new Vue({
store,
  render: h => h('frame', [h(App)])
}).$start();
