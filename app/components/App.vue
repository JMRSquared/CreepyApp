<template>
    <Page>
        <ActionBar>
            <GridLayout width="100%" columns="auto, *">
                <Label :text="'mdi-menu' | fonticon" verticalAlignment="center" :fontSize="30" class="mdi" @tap="$refs.drawer.nativeView.showDrawer()" col="0"/>
                <Label class="title" verticalAlignment="center" text="Welcome to the Sinister App!"  col="1"/>
            </GridLayout>
        </ActionBar>

        <RadSideDrawer ref="drawer">
            <StackLayout ~drawerContent backgroundColor="#ffffff">
                <Label class="drawer-header" text="GOD MODE"/>
                
                <GridLayout class="drawer-item" rows="auto,auto" columns="auto,*">
                    <Label :text="'mdi-target-account' | fonticon" rowSpan="2" verticalAlignment="center" :fontSize="25" class="mdi m-10"/>
                    <Label text="Session ID " class="t-14" col="1"/>
                    <Label :text="uniqueID" class="font-weight-bold t-16" row="1" col="1"/>
                </GridLayout>
                <GridLayout class="drawer-item" rows="auto,auto" columns="auto,*">
                    <Label :text="'mdi-account-plus-outline' | fonticon" rowSpan="2" verticalAlignment="center" :fontSize="25" class="mdi m-10"/>
                    <Label text="Link to session " class="t-14" col="1"/>
                    <Label text="TYP01" class="font-weight-bold t-16" row="1" col="1"/>
                </GridLayout>
                <Label class="drawer-item text-light-orange font-weight-bold" text="Victims"/>
                <ScrollView>
                    <StackLayout>
                        <GridLayout v-for="a in 5" :key="a" class="p-x-15 p-y-5" rows="auto,auto" columns="auto,*">
                            <Label :text="'mdi-account-circle-outline' | fonticon" rowSpan="2" verticalAlignment="center" :fontSize="25" class="mdi m-10"/>
                            <Label text="Sirwali Joseph" class="t-14" col="1"/>
                            <Label text="TYP01" class="font-weight-bold t-16" row="1" col="1"/>
                        </GridLayout>
                    </StackLayout>
                </ScrollView>
            </StackLayout>

            <GridLayout ~mainContent columns="*" rows="*">
                <Label class="message" :text="msg" col="0" row="0"/>
            </GridLayout>
        </RadSideDrawer>
    </Page>
</template>

<script lang="ts">
  export default {
    data() {
      return {
        msg: 'Hello World!'
      }
    }
  }
</script>

<style scoped>
    ActionBar {
        background-color: #ff6d00;
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
        padding: 50 16 16 16;
        margin-bottom: 16;
        background-color: #ff6d00;
        color: #ffffff;
        font-size: 24;
    }

    .drawer-item {
        padding: 8 16;
        font-size: 16;
    }
</style>
