const firebase = require("nativescript-plugin-firebase");

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

    getAllCollections(collectionName){
        return new Promise((resolve,reject) => {
            firebase.firestore()
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
}