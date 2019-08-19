<template>
  <page class="bg-white" actionBarHidden="true">
    <GridLayout rows="auto,*,auto" columns="*">
      <StackLayout>
        <Label verticalAlignment="center" textAlignment="center" class="text-dark-orange" text="Home page"></Label>
      </StackLayout>
      <StackLayout row="1">
        <Label verticalAlignment="center" textAlignment="center" class="text-dark-orange" :text="victimID"></Label>
      </StackLayout>
      <StackLayout row="2">
        <CardView elevation="10">
          <Label verticalAlignment="center" textAlignment="center" class="text-dark-orange" text="Home page"></Label>
        </CardView>
      </StackLayout>
    </GridLayout>
  </page>
</template>

<script lang="ts">
  export default {
    data() {
      return {
      }
    },
    props:["victimID"]
  }
</script>

<style scoped>
  
</style>
