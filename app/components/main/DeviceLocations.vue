<template>
  <page class="bg-white" actionBarHidden="true">
    <GridLayout rows="*,auto" columns="*">
      <ActivityIndicator
        v-if="isLoading"
        :busy="isLoading"
        rowSpan="3"
        verticalAlignment="center"
        textAlignment="center"
      />
      <StackLayout rowSpan="2">
        <MapView
          width="100%"
          height="100%"
          :zoom="9"
          :latitude="selectedLocation.latitude"
          :longitude="selectedLocation.longitude"
          @mapReady="mapReady"
        />
      </StackLayout>
      <CardView row="1" margin="25" class="p-t-10" elevation="10">
        <GridLayout
          class="p-t-10"
          rows="auto,auto,auto,auto,auto"
          columns="*,*"
        >
          <Label
            text="When : "
            textAlignment="right"
            class="font-weight-bold p-y-5"
            verticalAlignment="center"
            row="0"
            col="0"
          ></Label>
          <Label
            :text="getMoment(selectedLocation.timestamp).fromNow()"
            row="0"
            col="1"
            verticalAlignment="center"
          ></Label>
          <Label
            text="Speed : "
            textAlignment="right"
            class="font-weight-bold p-y-5"
            verticalAlignment="center"
            row="1"
            col="0"
          ></Label>
          <Label
            :text="`${selectedLocation.speed} km/h`"
            row="1"
            col="1"
            verticalAlignment="center"
          ></Label>
          <Label
            text="Altitude : "
            textAlignment="right"
            class="font-weight-bold p-y-5"
            verticalAlignment="center"
            row="2"
            col="0"
          ></Label>
          <Label
            :text="`${selectedLocation.altitude} meters`"
            row="2"
            col="1"
            verticalAlignment="center"
          ></Label>
          <Label
            text="Accuracy : "
            textAlignment="right"
            class="font-weight-bold p-y-5"
            verticalAlignment="center"
            row="3"
            col="0"
          ></Label>
          <Label
            v-if="selectedLocation.horizontalAccuracy"
            :text="`${selectedLocation.horizontalAccuracy.toFixed(2)} meters`"
            row="3"
            col="1"
            verticalAlignment="center"
          ></Label>
          <Button
            text="Change Location"
            row="4"
            width="100%"
            height="100%"
            colSpan="2"
            @tap="changeSelectedLocation"
            class="bg-dark-orange text-white"
          ></Button>
        </GridLayout>
      </CardView>
    </GridLayout>
  </page>
</template>

<script lang="ts">
const dialogs = require("ui/dialogs");
import {
  Position,
  Marker,
  MapView,
  Circle
} from "nativescript-google-maps-sdk";
import { Color } from "tns-core-modules/color/color";
export default {
  data() {
    return {
      selectedLocation: {
        latitude: -26.1955578,
        longitude: 28.0068975
      },
      allLocations: [],
      mapView: null
    };
  },
  props: ["victimID"],
  mounted() {
    if (!this.victimID) {
      return this.navigate(null);
    }
    console.log(
      "********************************WE WITHIN**********************************"
    );
    this.isLoading = true;
    this.loadMoreLocations(true);
  },
  methods: {
    mapReady(args) {
      try {
        this.isLoading = false;
        this.mapView = args.object;
      } catch (err) {
        console.log("AN ERROR HAPPENED", err);
      }
    },
    changeSelectedLocation() {
      const allLocationCurrentTimestamps = this.allLocations
        .filter(v => v)
        .map(v => this.getMoment(v.timestamp).fromNow());
      dialogs
        .action("Pick a location", "Close", allLocationCurrentTimestamps)
        .then(result => {
          const index = allLocationCurrentTimestamps.indexOf(result);
          this.selectedLocation = this.allLocations[index];
          this.refreshMarker();
        });
    },
    loadMoreLocations(mustSelect = false) {
      const lastDoc = this.allLocations[this.allLocations.length - 1];
      const lastDocId =
        lastDoc && lastDoc.length > 0 && lastDoc[lastDoc.length - 1].doc
          ? lastDoc[lastDoc.length - 1].doc
          : null;
      console.log("lastDocId", lastDocId);

      this.isLoading = true;
      this.$firebase
        .getLocationsFromCollection(this.victimID, lastDocId)
        .then(allDocs => {
          console.log("all docs", allDocs);
          this.allLocations = this.allLocations.concat(allDocs);
          if (this.mapView && this.allLocations.length > 0) {
            this.selectedLocation = this.allLocations[0];
            this.refreshMarker();
          }
          this.isLoading = false;
        })
        .catch(err => {
          console.log("An error has occured", err);
          this.isLoading = false;
        });
    },
    refreshMarker() {
      (this.mapView as MapView).removeAllMarkers();
      (this.mapView as MapView).removeAllShapes();
      const position = Position.positionFromLatLng(
        this.selectedLocation.latitude,
        this.selectedLocation.longitude
      );

      const currentMarker = new Marker();
      currentMarker.position = position;
      currentMarker.draggable = false;
      currentMarker.visible = true;

      const currentCircle = new Circle();
      currentCircle.center = position;
      currentCircle.radius = this.selectedLocation.horizontalAccuracy;
      currentCircle.fillColor = new Color(50, 196, 60, 0);
      currentCircle.strokeColor = new Color(100, 196, 60, 0);
      currentCircle.visible = true;

      (this.mapView as MapView).addMarker(currentMarker);
      (this.mapView as MapView).addCircle(currentCircle);
    }
  }
};
</script>

<style lang="scss" scoped>
$blue: #74b9ff;

.highlight-under {
  border-bottom-width: 2;
  border-bottom-color: white;
}

.chat-bubble {
  padding: 10px 14px;
  background: #eee;
  margin: 10px 30px;
  border-radius: 9px;
  position: relative;
  animation: fadeIn 1s ease-in;

  &:after {
    content: "";
    position: absolute;
    top: 50%;
    width: 0;
    height: 0;
    border: 20px solid transparent;
    border-bottom: 0;
    margin-top: -10px;
  }

  &--left {
    &:after {
      left: 0;
      border-right-color: #eee;
      border-left: 0;
      margin-left: -20px;
    }
  }

  &--right {
    &:after {
      right: 0;
      border-left-color: $blue;
      border-right: 0;
      margin-right: -20px;
    }
  }
}
</style>