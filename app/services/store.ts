import Vue from 'vue';
import Vuex from 'vuex';
import Database from '../services/database';
const appSettings = require("tns-core-modules/application-settings");
const storage = new Database();

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    victims:[]
  },
  mutations: {
    loadVictims(state){
      const documentID = appSettings.getString("USER_VICTIMS");
      const victims = storage.get(documentID);
      state.victims = victims ? victims : [];
    },
    addVictim(state,obj){
      const documentID = appSettings.getString("USER_VICTIMS");
      const newDocId = storage.add(obj,documentID);
      if(!documentID){
        appSettings.setString("USER_VICTIMS",newDocId);  
      }
      const victims = storage.get(documentID);
      state.victims = victims ? victims : [];
    }
  },
  actions: {

  }
});
