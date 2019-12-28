<template>
  <GridLayout rows="auto,*,auto" columns="*,auto" class="m-20">
    <label
      class="m-5"
      colSpan="2"
      textAlignment="center"
      :fontSize="20"
      :textWrap="true"
      text="Scan the QR-Code from a device."
    ></label>
    <MLKitBarcodeScanner
      :beepOnScan="false"
      verticalAlignment="top"
      colSpan="2"
      row="1"
      formats="QR_CODE,"
      :preferFrontCamera="false"
      :supportInverseBarcodes="false"
      processEveryNthFrame="2"
      torchOn="torchOn"
      @scanResult="onScanQr"
    >
      >
    </MLKitBarcodeScanner>
    <label
      v-if="txtError"
      :textWrap="true"
      class="p-5"
      :text="txtError"
      row="2"
    ></label>
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
const appSettings = require("tns-core-modules/application-settings");
export default {
  data() {
    return {
      txtError: null
    };
  },
  methods: {
    onScanQr(event) {
      const found = event.value.barcodes.filter(
        v => v && v.value && v.value.indexOf("sinister") >= 0
      );
      if (event.value.barcodes.length > 0 && found.length == 0) {
        this.$modal.close("Invalid");
      } else if (found.length > 0) {
        this.$modal.close(found[0].value);
      }
    }
  }
};
</script>