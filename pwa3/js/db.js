window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
if (!window.indexedDB) {
  window.alert('Ihr Browser unterstützt keine stabile Version von IndexedDB.');
}

const data = [
  { id: '1', room: 'A1', topic: 'Informatik', title: 'Zukunft von Bitcoin', time:'10:00' },
  { id: '2', room: 'A2', topic: 'Informatik', title: 'Künstliche Intelligenz im Alltag', time:'11:00'  },
  { id: '3', room: 'A1', topic: 'Informatik', title: 'Sicherheit in IoT', time:'18:00'  },
  { id: '4', room: 'A4', topic: 'Unterhaltung', title: 'Wie Netflix unseren Filmgeschmack bestimmt.', time:'09:00'  },
  { id: '5', room: 'A3', topic: 'Unterhaltung', title: 'Streaming-Rechte bei Sportübertragungen.', time:'14:30'  },
  { id: '6', room: 'A4', topic: 'Unterhaltung', title: 'CeBIT-Aus: Wer ist schuld?', time:'12:00'  },
  { id: '7', room: 'A2', topic: 'Management', title: '', time:'16:00'  },
  { id: '8', room: 'A1', topic: 'Management', title: '', time:'14:00'  },
  { id: '9', room: 'A4', topic: 'Management', title: '', time:'19:00-21:00'  },
];

let db;
const dbName = 'mmsysDB';
// Datenbank öffnen,
let request = window.indexedDB.open(dbName, 1);

request.onerror = function(event) {
  console.log('Fehler bei der Verbindung zu IndexedDB');
};

// Datenbank initial befüllen, falls leer
request.onupgradeneeded = function(event) {
  let db = event.target.result;
  // keyPath = Primärschlüssel
  let objectStore = db.createObjectStore('talks', { keyPath: 'id' });
  // Suchindizes für Daten erstellen
  objectStore.createIndex('room', 'room', { unique: false });
  objectStore.createIndex('topic', 'topic', { unique: false });
  // Daten hinzufügen
  for (let i = 0; i < data.length; i++) {
    objectStore.add(data[i]);
  }
  console.log('Datenbank erstellt und gespeichert.');
};

async function getRecords(keys, props, operator) {
  return new Promise(function(resolve, reject){
    let request = window.indexedDB.open(dbName, 1)
    request.onsuccess = function() {
      db = request.result;
      let transaction = db.transaction('talks').objectStore('talks');
      if (keys===undefined) {
        transaction.getAll().onsuccess = function(event) {
          let res = event.target.result;
          resolve(res);
        }
        transaction.getAll().onerror = function(event) { reject(event) };
      } else {
        let cursorRequest = transaction.openCursor();
        let res = [];
        cursorRequest.onsuccess = function(event) {
          let cursor = event.target.result;
          //console.dir(cursor);
          if (cursor) {
            let values = [cursor.value.room, cursor.value.topic];
            let condition;
            if (operator==='OR') {
              condition = keys.includes(values[0]) || keys.includes(values[1]);
            } else {
              condition = keys.includes(values[0]) && keys.includes(values[1]);
            }
            if (condition) {
              var talk = {};
              for (prop of props) {
                talk[prop] = cursor.value[prop];
              }
              res.push(talk);
            }
            cursor.continue();
          } else {
            console.log('Keine passenden Einträge mehr gefunden.');
            resolve(res);
          }
        }
        cursorRequest.onerror = function(event) { reject(event) };
      }
    }
    request.onerror = function(event) { reject(event) };
  });
}
