let idb = async function (dbname, collection) {
    return new Promise((resolve, reject) => {
        if (!('indexedDB' in window))
            reject("Your browser doesn't support IndexedDB");
        let db = null;
        let dbReq = indexedDB.open(dbname, 1);
        dbReq.onerror = (error) => {
            reject(error);
        }
        dbReq.onsuccess = (ev) => {
            db = ev.target.result;
            resolve(functions);
        }
        dbReq.onupgradeneeded = (ev) => {
            db = ev.target.result;
            ev.target.transaction.oncomplete = (e) => {
                resolve(functions);
            }
            if (!db.objectStoreNames.contains('commentStore')) {
                let commentStore = db.createObjectStore('commentStore', {
                    keyPath: '_id'
                });
                commentStore.createIndex('commentByPost', 'post', {
                    unique: false
                });
            } else if (!db.objectStoreNames.contains('syncStore')) {
                db.createObjectStore('syncStore', {
                    autoIncrement: true
                });
            } else {
                resolve(functions);
            }
        }
        const add = async (comment) => {
            return new Promise((resolve, reject) => {
                if (!comment._id)
                    comment["_id"] = uuidv4();
                let tx = db.transaction(collection, 'readwrite');
                tx.oncomplete = (ev) => {
                    resolve(comment);
                }
                tx.onerror = (error) => {
                    reject(error);
                }
                let store = tx.objectStore(collection);
                let request = store.add(comment);
                request.onerror = (error) => {
                    reject(error);
                }
            });
        }
        const get = async (_id) => {
            return new Promise((resolve, reject) => {
                let comment = {};
                let tx = db.transaction(collection, 'readonly');
                tx.oncomplete = (ev) => {
                    resolve(comment);
                }
                tx.onerror = reject;
                let store = tx.objectStore(collection);
                let request = store.get(_id);
                request.onsuccess = (ev) => {
                    comment = ev.target.result;
                }
                request.onerror = reject;
            });
        }
        const getAll = async (post) => {
            return new Promise((resolve, reject) => {
                let tx = db.transaction(collection, 'readonly');
                tx.oncomplete = (ev) => {
                    resolve(comments);
                }
                tx.onerror = reject;
                let store = tx.objectStore(collection);
                var request;
                if (collection === 'commentStore') {
                    let postIndex = store.index('commentByPost');
                    request = postIndex.getAll(IDBKeyRange.bound(post, post));
                }
                else{
                    request = store.getAll();
                }
                let comments = [];
                request.onsuccess = (ev) => {
                    comments = ev.target.result;
                }
                request.onerror = reject;
            });
        }
        const put = async (comment) => {
            return new Promise(async (resolve, reject) => {
                if (!comment) {
                    reject("No comment to update");
                    return;
                }
                let tx = db.transaction(collection, 'readwrite');
                tx.oncomplete = (ev) => {
                    resolve(comment);
                }
                tx.onerror = reject;
                let store = tx.objectStore(collection);
                let request = store.put(comment);
                request.onerror = reject;
            });
        }
        const _delete = async (_id) => {
            return new Promise(async (resolve, reject) => {
                let comment = await get(_id);
                if (!comment) {
                    reject("No comment to delete");
                    return;
                }
                let tx = db.transaction(collection, 'readwrite');
                tx.oncomplete = (ev) => {
                    resolve(comment);
                }
                tx.onerror = reject;
                let store = tx.objectStore(collection);
                let request = store.delete(_id);
                request.onerror = reject;
            });
        }
        let functions = {
            add,
            get,
            getAll,
            put,
            _delete
        }
    });
};