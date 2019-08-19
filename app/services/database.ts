import { Couchbase } from 'nativescript-couchbase-plugin';

export default class Database {
    db:Couchbase;

    constructor(){
        this.db = new Couchbase('SinisterDB');
    }

    add(obj,documentId = null){
        if(documentId){
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
        return this.db.createDocument(doc);
    }

    get(documentId){
        const doc = this.db.getDocument(documentId);
        return doc ? doc.value : null;
    }

    delete(documentId){
        return this.db.deleteDocument(documentId);
    }
}