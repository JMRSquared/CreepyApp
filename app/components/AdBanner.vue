<template>
  <StackLayout>
    <Ripple @tap="showAdVideo()">
      <GridLayout class="p-x-5" rows="auto,auto" columns="auto,*,auto">
        <Label
          :text="'mdi-video' | fonticon"
          rowSpan="2"
          verticalAlignment="center"
          :fontSize="25"
          class="mdi m-10"
        />
        <Label text="Watch a short video" class="t-14" col="1" />
        <Label
          text="Thanks for the support"
          class="font-weight-bold t-16"
          row="1"
          col="1"
        />
      </GridLayout>
    </Ripple>
  </StackLayout>
</template>

<script lang="ts">
export default {
  data() {
    return {};
  },
  mounted() {
    setTimeout(() => {
      this.loadAdMob();
      this.$forceUpdate();
    }, 2000);
  },
  methods: {
    loadAdMob() {
      /*this.$firebase.admob
        .showBanner({
          size: this.$firebase.admob.AD_SIZE.SMART_BANNER, // see firebase.admob.AD_SIZE for all options
          margins: {
            bottom: 10
          },
          androidBannerId: "ca-app-pub-4924835910036108/4611034320",
          iosBannerId: "ca-app-pub-4924835910036108/4611034320",
          testing: this.TNS_ENV !== "production", // when not running in production set this to true, Google doesn't like it any other way
          iosTestDeviceIds: [],
          keywords: [
            "degree",
            "work",
            "loans",
            "insurance",
            "trading",
            "business",
            "money",
            "cash",
            "rich",
            "free",
            "job",
            "work"
          ] // add keywords for ad targeting
        })
        .then(
          function() {
            console.log("AdMob banner loaded");
          },
          function(errorMessage) {
            console.log("AdMob banner error", errorMessage);
          }
        );*/
      this.$firebase.admob
        .preloadInterstitial({
          iosInterstitialId: "ca-app-pub-4924835910036108/8316962154",
          androidInterstitialId: "ca-app-pub-4924835910036108/8316962154",
          testing: this.TNS_ENV !== "production", // when not running in production set this to true, Google doesn't like it any other way
          iosTestDeviceIds: [],
          onClosed: () => console.log("Interstitial closed"),
          onClicked: () => console.log("Interstitial clicked"),
          onOpened: () => console.log("Interstitial opened"),
          onLeftApplication: () => console.log("Interstitial left application")
        })
        .then(
          function() {
            this.adIsReady = true;
            console.log(
              "AdMob interstitial preloaded, you can now call 'showInterstitial' at any time to show it without delay."
            );
          },
          function(errorMessage) {
            console.log("AdMob interstitial error", errorMessage);
          }
        );
    },
    showAdVideo() {
      this.$firebase.admob
        .showInterstitial()
        .then(response => {
          console.log("Response,=,,", response);
        })
        .catch(err => {
          // 114 000
          console.log("Error,=,,", err);
        });
    }
  }
};
</script>