import Home from "../components/main/Home.vue";
import NotificationScreen from "../components/main/NotificationScreen.vue";

const routes = {
    "/home": {
      name: "home",
      component: Home,
    },
    "/notification/screen": {
      name: "notificationScreen",
      component: NotificationScreen,
    }
}

export default routes;
