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
          :latitude="selectedLocation.lat"
          :longitude="selectedLocation.lng"
          @mapReady="mapReady"
          @coordinateLongPress="locationSelected"/>
      </StackLayout>
      <CardView row="1" margin="25" class="p-t-10" elevation="10">
        <GridLayout class="p-t-10" rows="auto,auto,auto,auto" columns="*,*">
          <Label text="When : " textAlignment="right" class="font-weight-bold p-y-5" verticalAlignment="center" row="0" col="0"></Label>
          <Label :text="getMoment(selectedLocation.timestamp).fromNow()" row="0" col="1" verticalAlignment="center"></Label>
          <Label text="Speed : " textAlignment="right" class="font-weight-bold p-y-5" verticalAlignment="center" row="1" col="0"></Label>
          <Label :text="`${selectedLocation.speed} km/h`" row="1" col="1" verticalAlignment="center"></Label>
          <Label text="Altitude : " textAlignment="right" class="font-weight-bold p-y-5" verticalAlignment="center" row="2" col="0"></Label>
          <Label :text="selectedLocation.altitude" row="2" col="1" verticalAlignment="center"></Label>
          <Button text="Change Location" row="3" width="100%" height="100%" colSpan="2" @tap="changeSelectedLocation" class="bg-dark-orange text-white"></Button>
        </GridLayout>
      </CardView>
    </GridLayout>
  </page>
</template>

<script lang="ts">
const dialogs =  require("ui/dialogs");
import { Position, Marker } from "nativescript-google-maps-sdk";
export default {
  data() {
    return {
      selectedLocation:{
        lat:-26.1955578,
        lng:28.0068975
      },
      currentMarker:new Marker(),
      allLocations:[]
    };
  },
  props: ["victimID"],
  mounted() {
    if (!this.victimID) {
      return this.navigate(null);
    }
    this.isLoading = true;
    this.loadMoreLocations(true);
  },
  methods: {
    mapReady(args) {
      /* get the mapView instance */
      try{
        this.isLoading = false;
        this.mapView = args.object;
        this.currentMarker.position = Position.positionFromLatLng(this.selectedLocation.lat, this.selectedLocation.lng);
        this.currentMarker.draggable = true;
        this.currentMarker.visible = true;
        this.mapView.addMarker(this.currentMarker);
      }catch(err){
        console.log("AN ERROR HAPPENED",err)
      }
    },
    locationSelected(args) {
      /* get coordinates of the point where user long pressed */
      let lat = args.position.latitude;
      let lng = args.position.longitude;
    },
    changeSelectedLocation(){
      const allLocationCurrentTimestamps = this.allLocations.filter(v => v).map(v => `${this.getMoment(v.timestamp).fromNow()} ${v.altitude}`);
      dialogs.action("Pick a location", "Close", allLocationCurrentTimestamps)
      .then(result => {
        const index = allLocationCurrentTimestamps.indexOf(result);
        this.selectedLocation = this.allLocations[index];
      });
    },
    loadMoreLocations(mustSelect = false){
      const lastDoc = this.allLocations[this.allLocations.length - 1];
      const lastDocId = lastDoc && lastDoc.length > 0 && lastDoc[lastDoc.length -1].doc ? lastDoc[lastDoc.length -1].doc : null;
      console.log("lastDocId",lastDocId);
      
      this.isLoading = true;
      this.$firebase
        .getLocationsFromCollection(this.victimID,lastDocId)
        .then(allDocs => {
          console.log("all docs",allDocs);
          this.allLocations = this.allLocations.concat(allDocs);
          if(mustSelect && this.allLocations.length > 0){
            this.selectedLocation = this.allLocations[0];
            console.log("selectedLocation docs",this.selectedLocation);
          }
          this.isLoading = false;
        })
        .catch(err => {
          console.log("An error has occured", err);
          this.isLoading = false;
        });
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