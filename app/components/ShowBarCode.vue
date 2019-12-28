<template>
  <GridLayout rows="auto,*,auto" columns="*,auto" class="m-20">
    <label
      class="m-5"
      colSpan="2"
      textAlignment="center"
      :fontSize="20"
      :textWrap="true"
      text="Scan the QR-Code using the other device."
    ></label>
    <Image
      class="m-y-5"
      colSpan="2"
      row="1"
      stretch="aspectFit"
      :src="qrCodeImage"
    ></Image>
    <Button
      class="p-5"
      col="1"
      row="2"
      text="Close"
      @tap="$modal.close()"
    ></Button>
  </GridLayout>
</template>

<script lang="ts">
import { Vibrate } from "nativescript-vibrate";
const appSettings = require("tns-core-modules/application-settings");
export default {
  data() {
    return {
      qrCodeImage: null
    };
  },
  mounted() {
    this.qrCodeImage = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${appSettings.getString(
      "uniqueID"
    )}`;
    console.log("this.qrCodeImage", this.qrCodeImage);
  }
};
</script>