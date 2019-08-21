<template>
  <page class="bg-white" actionBarHidden="true">
    <GridLayout rows="*" columns="*">
      <ActivityIndicator v-if="isLoading" :busy="isLoading" verticalAlignment="center" textAlignment="center" />
      <StackLayout>
        <GridLayout rows="auto,*" columns="*">
          <ScrollView class="bg-dark-orange" orientation="horizontal">
            <StackLayout orientation="horizontal">
              <StackLayout @tap="indexChange(i)" class="m-x-10 p-t-20 p-b-10" v-for="(collectionName,i) in collectionNames" :key="i">
                <Label class="text-white t-16" :class="{'font-weight-bold highlight-under':i == selectedIndex}" verticalAlignment="bottom" textAlignment="center" :text="collectionName" />
              </StackLayout>
            </StackLayout>
          </ScrollView>
          <StackLayout row="1" v-if="collectionNames.length > selectedIndex && allMessages.hasOwnProperty(collectionNames[selectedIndex])">
            <ScrollView>
              <StackLayout>
                <GridLayout rows="auto" v-for="(msg,i) in allMessages[collectionNames[selectedIndex]]" :key="i">
                  <label :text="msg.body"></label>
                </GridLayout>
              </StackLayout>
            </ScrollView>
          </StackLayout>
        </GridLayout> 
      </StackLayout>
    </GridLayout>
  </page>
</template>

<script lang="ts">
  export default {
    data() {
      return {
        selectedIndex:0,
        collectionNames:[],
        allMessages:{}
      }
    },
    props:["victimID"],
    mounted(){
      if(!this.victimID){
        return this.navigate(null);
      }
      this.isLoading = true;
      this.$firebase.getApplicationNamesToCollection(this.victimID).then(doc => {
        this.collectionNames = doc && doc["application-names"] ? doc["application-names"] : []; 
        this.isLoading = false; 
        this.collectionNames.forEach(name => {
          if(!this.allMessages.hasOwnProperty(name)){
            this.allMessages[name] = [];
          }
        });
        this.indexChange(0);
      }).catch(err => {
        console.log("An error has occured",err);
        this.isLoading = false;
      })
    },
    methods:{
      indexChange(newIndex) {
        this.isLoading = true;
        if(this.collectionNames && this.collectionNames.length > newIndex){
            const appName = this.collectionNames[newIndex];
            this.isLoading = true;
            this.$firebase.getMessagesFromCollection(this.victimID,appName).then(allDocs => {
              this.isLoading = false;
              this.allMessages[appName] = allDocs;
              this.selectedIndex = newIndex;
              console.log("All data is in",allDocs);
            }).catch(err => {
              console.log("An error has occured",err);
              this.isLoading = false;
            })
        }else{
          console.log("We are out of bounds");
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  $blue: #74b9ff;

.highlight-under{
  padding-bottom: 5;
  border-bottom-width: 1;
  border-bottom-color: #ff6d00;
}

.chat-bubble {
  padding: 10px 14px;
  background: #eee;
  margin: 10px 30px;
  border-radius: 9px;
  position: relative;
  animation: fadeIn 1s ease-in;
  
  &:after {
    content: '';
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
