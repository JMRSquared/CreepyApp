import { Couchbase } from 'nativescript-couchbase-plugin';

export default class Database {
    db: Couchbase;

    constructor() {
        this.db = new Couchbase('SinisterDB');
    }

    add(obj, documentId = null) {
        if (documentId) {
            console.log("adding", documentId);
            const doc = this.db.getDocument(documentId);
            if (doc) {
                console.log("The OBJ", obj)
                if (obj && obj.userId && doc.value.some(v => v.userId == obj.userId)) {
                    const index = doc.value.findIndex(v => v.userId == obj.userId);
                    doc.value[index] = obj;
                } else {
                    doc.value.push(obj);
                }
                return this.db.updateDocument(documentId, doc);
            }
            return null;
        }
        const doc = {
            value: [obj]
        }
        console.log("creating", doc);
        return this.db.createDocument(doc);
    }

    remove(obj, documentId = null) {
        if (documentId) {
            console.log("removing", documentId);
            const doc = this.db.getDocument(documentId);
            if (doc) {
                if (obj && obj.userId && doc.value.some(v => v.userId == obj.userId)) {
                    doc.value = doc.value.filter(v => v.userId != obj.userId);
                }
                return this.db.updateDocument(documentId, doc);
            }
            return null;
        }
        return null;
    }

    get(documentId) {
        if (!documentId) {
            return null;
        }
        const doc = this.db.getDocument(documentId);
        return doc ? doc.value : null;
    }

    delete(documentId) {
        if (!documentId) {
            return null;
        }
        return this.db.deleteDocument(documentId);
    }
}