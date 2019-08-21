<template>
    <Page>
        <GridLayout rows="auto,*" columns="*">
            <CardView elevation="0" row="0">
                <GridLayout class="top-nav" width="100%" columns="auto,*,auto">
                    <Label :text="'mdi-menu' | fonticon" verticalAlignment="center" :fontSize="30" class="mdi" @tap="$refs.drawer.nativeView.toggleDrawerState()" col="0"/>
                    <Label class="title" verticalAlignment="center" text="Sinister!"  col="1"/>        
                    <Label @tap="goHomeClear()" :text="'mdi-home-outline' | fonticon" col="2" verticalAlignment="center" :fontSize="30" class="mdi"/>
                </GridLayout>
            </CardView>
            <RadSideDrawer row="1" ref="drawer">
                <StackLayout ~drawerContent backgroundColor="#ffffff">
                    <GridLayout class="drawer-header" rows="auto,auto" columns="auto,*">
                        <Label :text="'mdi-target-account' | fonticon" rowSpan="2" verticalAlignment="center" :fontSize="30" class="mdi m-10"/>
                        <Label text="User ID " class="t-16" col="1"/>
                        <Label :text="uniqueID" class="font-weight-bold t-18" row="1" col="1"/> 
                   </GridLayout>
                    <Label class="drawer-item text-light-orange font-weight-bold" text="Victims"/>
                    <GridLayout class="drawer-item" rows="*">
                        <ScrollView>
                            <StackLayout>
                                <Ripple v-for="(victim,i) in victims" :key="i" @tap="goToNotificationScreen(victim.userId)">
                                    <GridLayout class="p-5" rows="auto,auto,auto" columns="auto,*,auto">
                                        <Label :text="'mdi-account-circle-outline' | fonticon" rowSpan="2" verticalAlignment="center" :fontSize="25" class="mdi m-10"/>
                                        <Label :text="victim.displayName" class="t-14" col="1"/>
                                        <Label :text="victim.userId" class="font-weight-bold t-16" row="1" col="1"/>
                                        <Label text="10" class="t-20" verticalAlignment="center" rowSpan="2" col="2"/>
                                        <StackLayout class="bottom-line p-x-25 p-y-25" colSpan="3" row="2"></StackLayout>
                                    </GridLayout>
                                </Ripple>
                            </StackLayout>
                        </ScrollView>
                        <Fab
                            @tap="addNewVictim"
                            icon="res://ic_shield_plus_outline_white_24dp"
                            class="fab-button"></Fab>
                    </GridLayout>
                </StackLayout>

                <GridLayout ~mainContent columns="*" rows="auto,*">
                    <Navigator row="1" defaultRoute="/home" />
                </GridLayout>
            </RadSideDrawer>
        </GridLayout>
    </Page>
</template>

<script lang="ts">
  import { login, alert, prompt } from "nativescript-material-dialogs";
  export default {
    data() {
      return {
        msg: 'Hello World!'
      }
    },
    mounted(){
        console.log("Global vics",this.victims);
    },
    methods:{
        goHomeClear(){
            this.navigate("/home",null,{
                clearHistory:true
            });
        },
        goToNotificationScreen(victimID){
            this.$refs.drawer.nativeView.closeDrawer();
            this.navigate("/notification/screen",{
                victimID
            })
        },
        async addNewVictim(){
            const userID = await prompt({
                title: "Provide the User id of the victim",
                okButtonText: "Next",
                cancelButtonText: "Cancel"
            });
            setTimeout(async () => {
                if(userID && userID.result){
                    if(!userID.text || userID.text.length < 3){
                        return alert("Provide a valid User ID");
                    }
                    const displayName = await prompt({
                        title: "Provide a display name to use",
                        okButtonText: "Save",
                        cancelButtonText: "Cancel"
                    });
                    if(displayName && displayName.result){
                        if(!displayName.text || displayName.text.length < 3){
                            return alert("Provide a valid Display name");
                        }
                        this.saveNewVictimLocally(userID.text,displayName.text);
                    }
                }
            },0)
        }
    }
  }
</script>

<style scoped>
    .bottom-line{
        height: 1;
        background-color: #ff6d00;
        opacity:0.3;
    }

    .top-nav {
        padding:10;
        background-color: #c43c00;
        color: #ffffff;
    }

    .title {
        text-align: left;
        padding-left: 16;
    }

    .message {
        vertical-align: center;
        text-align: center;
        font-size: 20;
        color: #c43c00;
    }

    .drawer-header {
        padding: 20 16 10 4;
        margin-bottom: 16;
        background-color: #c43c00;
        color: #ffffff;
        font-size: 24;
    }

    .drawer-item {
        padding: 8;
        font-size: 16;
    }
</style>
