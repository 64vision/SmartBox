// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: 'app',
    paths: {
        lib: '../lib',
        bootstrap: '../dist/js',
    }
});

// Start loading the main app file. Put all of
// your application logic in there.
/*requirejs(['lib/create']);
requirejs(['bootstrap/bootstrap']);
requirejs(['socketio']);
requirejs(['global']);
requirejs(['issp']);
requirejs(['player']);
requirejs(['db']);
requirejs(['cache']);
requirejs(['main']);*/
requirejs(['bootstrap/bootstrap']);
requirejs(['db']);
requirejs(['global']);
requirejs(['library']);
requirejs(['issp']);
requirejs(['ui']);
requirejs(['isspcontroller']);


