import { Couchbase } from 'nativescript-couchbase-plugin';

export default class Database {
    db:Couchbase;

    constructor(){
        this.db = new Couchbase('SinisterDB');
    }

    add(obj,documentId = null){
        if(documentId){
           console.log("adding",documentId);
           const doc = this.db.getDocument(documentId);
           if(doc){
            doc.value.push(obj);
            return this.db.updateDocument(documentId,doc);
           }
           return null;
        }
        const doc = {
            value : [obj]
        }
        console.log("creating",doc);
        return this.db.createDocument(doc);
    }

    get(documentId){
        if(!documentId){
            return null;
        }
        const doc = this.db.getDocument(documentId);
        return doc ? doc.value : null;
    }

    delete(documentId){
        if(!documentId){
            return null;
        }
        return this.db.deleteDocument(documentId);
    }
}