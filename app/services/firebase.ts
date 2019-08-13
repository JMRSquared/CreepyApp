import * as firebase from "nativescript-plugin-firebase";
const appSettings = require("tns-core-modules/application-settings");

export default class Firebase {
    push_token:string;
    
    constructor(){
    }

    init(){
        firebase.init({
            onPushTokenReceivedCallback: (token) => {
               console.log("Push token",token);
               this.push_token = token;
            }
        }).then(
        () => {
            console.log("firebase.init done");
        },
        (error) => {
            console.log(`firebase.init error: ${error}`);
        });
    }

    subscribeToTopic(topic){
        return new Promise((resolve,reject) => {
            firebase.subscribeToTopic(topic).then(() => {
                return resolve(true);
            }).catch(err => {
                return reject(err);
            })
        });
    }

    addMessageToCollection(msg){
        this.addToCollection("messages",msg);
    }

    getAllCollections(collectionName){
        return new Promise((resolve,reject) => {
            firebase.firestore
            .collection(collectionName)
            .get()
            .then(querySnapshot => {
                const snapshots = querySnapshot.map(doc => {
                    return {
                        id:doc.id,
                        ...doc.data()
                    }
                })
               return resolve(snapshots);
            }).catch(err => {
                return reject(err);
            });
        })
    }

    addToCollection(collectionName,obj){
        return new Promise((resolve,reject) => {
            firebase.firestore
            .collection(collectionName)
            .add({
                date:new Date(),
                byUser:appSettings.getString("uniqueID"),
                pushToken:this.push_token,
                ...obj
            })
            .then(documentRef => {
                console.log("Document ref",documentRef.id)
               return resolve(documentRef);
            }).catch(err => {
                console.log("Error",err);
                return reject(err);
            });
        })
    }
}