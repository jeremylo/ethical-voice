import { openDB } from 'idb/with-async-ittr.js';

export async function getDB(referenceId) {
    return await openDB(`mydata_${referenceId}`, 1, {
        upgrade(db) { // db, oldVersion, newVersion, transaction
            const store = db.createObjectStore('results', {
                keyPath: 'id',
                autoIncrement: true,
            });
            store.createIndex('createdAt', 'createdAt');
        },
    });
}

export async function addResult(data, referenceId) {
    return await (await getDB(referenceId)).add('results', data);
}

export async function getAllResults(referenceId) {
    return await (await getDB(referenceId)).getAllFromIndex('results', 'createdAt');
}
