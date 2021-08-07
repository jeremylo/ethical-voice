import { openDB } from 'idb/with-async-ittr.js';

let db;

export async function getDB() {
    if (db) return db;

    return (db = await openDB('mydata', 1, {
        upgrade(db) { // db, oldVersion, newVersion, transaction
            const store = db.createObjectStore('results', {
                keyPath: 'id',
                autoIncrement: true,
            });
            store.createIndex('createdAt', 'createdAt');
        },
    }));
}

export async function addResult(data) {
    return await getDB().add('results', data);
}

export async function getAllResults() {
    return await getDB().getAllFromIndex('results', 'createdAt');
}
