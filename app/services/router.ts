import Home from "../components/main/Home.vue";
import NotificationScreen from "../components/main/NotificationScreen.vue";
import DeviceLocations from "../components/main/DeviceLocations.vue";

const routes = {
    "/home": {
      name: "home",
      component: Home,
    },
    "/notification/screen": {
      name: "notificationScreen",
      component: NotificationScreen,
    },
    "/device/locations": {
      name: "deviceLocations",
      component: DeviceLocations,
    }
}

export default routes;
