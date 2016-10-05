var todoDB =  (function() {
  var tDB = {};
  var datastore = null;

 /**
 * Open a connection to the datastore.
 */
tDB.open = function(table, callback) {
  // Database version.
  var version = 1.0;

  // Open a connection to the datastore.
  var request = indexedDB.open('ISSPDB', version);

  // Handle datastore upgrades.
  request.onupgradeneeded = function(e) {
    var db = e.target.result;

    e.target.transaction.onerror = tDB.onerror;

    // Delete the old datastore.
    if (db.objectStoreNames.contains(table)) {
      db.deleteObjectStore(table);
    }

    // Create a new datastore.
    var store = db.createObjectStore(table, {
      keyPath: 'timestamp'
    });
  };

  // Handle successful datastore access.
  request.onsuccess = function(e) {
    // Get a reference to the DB.
    datastore = e.target.result;
    //console.log("Success");
    // Execute the callback.
    callback();
  };
  // Handle errors when opening the datastore.
  request.onerror = tDB.onerror;
};



/**
 * Fetch all of the todo items in the datastore.
 */
tDB.fetchTodos = function(table, callback) {
  var db = datastore;
  var transaction = db.transaction([table], 'readwrite');
  var objStore = transaction.objectStore(table);
  var keyRange = IDBKeyRange.lowerBound(0);
  var cursorRequest = objStore.openCursor(keyRange);

  var todos = [];

  transaction.oncomplete = function(e) {
    // Execute the callback function.
    callback(todos);
  };

  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;

    if (!!result == false) {
      return;
    }
    //console.log(result.value);
    todos.push(result.value);

    result.continue();
  };

  cursorRequest.onerror = tDB.onerror;
};


/**
 * Create a new todo item.
 */
tDB.createTodo = function(table, db_params, callback) {
  // Get a reference to the db.
  var db = datastore;

  // Initiate a new transaction.
  var transaction = db.transaction([table], 'readwrite');

  // Get the datastore.
  var objStore = transaction.objectStore(table);
  // Create the datastore request.
  var request = objStore.put(db_params);

  // Handle a successful datastore put.
  request.onsuccess = function(e) {
    // Execute the callback function.
    callback(db_params);
  };

  // Handle errors.
  request.onerror = tDB.onerror;
};


/**
 * Create a new todo item.
 */
tDB.clearTodo = function(table, callback) {
  // Get a reference to the db.
  var db = datastore;

  // Initiate a new transaction.
  var transaction = db.transaction([table], 'readwrite');

  // Get the datastore.
  var objStore = transaction.objectStore(table);
    var request = objStore.clear();

  // Handle a successful datastore put.
  request.onsuccess = function(e) {
    // Execute the callback function.
    callback();
  };

  // Handle errors.
  request.onerror = tDB.onerror;
};



/**
 * Delete a todo item.
 */
tDB.deleteTodo = function(id, callback) {
  var db = datastore;
  var transaction = db.transaction(['media'], 'readwrite');
  var objStore = transaction.objectStore('media');

  var request = objStore.delete(id);

  request.onsuccess = function(e) {
    callback();
  }

  request.onerror = function(e) {
    console.log(e);
  }
};


/**
 * Delete a todo item.
 */
tDB.searchTodo = function(table, zonename, callback) {
   var db = datastore;
  var transaction = db.transaction([table], 'readwrite');
  var objStore = transaction.objectStore(table);
  var keyRange = IDBKeyRange.lowerBound(0);
  var cursorRequest = objStore.openCursor(keyRange);

  var todos = [];

  transaction.oncomplete = function(e) {
    // Execute the callback function.
    callback(todos);
  };

  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
    var obj = {};
    if (!!result == false) {
      return;
    }
    obj=result.value
    //console.log(result.value);
    if(obj.zonename == zonename) {
      todos.push(result.value);
    }
    

    result.continue();
  };

  cursorRequest.onerror = tDB.onerror;
};

  // Export the tDB object.
  return tDB;
}());