/*
Required modules for application

1. watchr - nodejs module for watching in the filesystem
2. socket.io - nodejs module for using websockets
3. express - for implementing the server
4. myfs - user created module with for checking filesystem

*/
var myfs = require('./myfs');
var watcher = require('watchr');
var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

/*
    Variables for the paths of the folders that need to be watch
*/
var pathHK = 'fromHK/';
var pathTW = 'fromTW/';
var pathFullQC = 'fullQC/';
var pathDubbed = 'OutsourceDubbed/';
var pathMixed = 'OutsourceMixed/';
var pathTQC = 'tqc/';
var pathFailed = 'failed/';

if (process.platform === 'win32') {
    pathHK = 'fromHK/';
    pathTW = 'fromTW/';
    pathFullQC = 'fullQC/';
    pathDubbed = 'OutsourceDubbed/';
    pathMixed = 'OutsourceMixed/';
    pathTQC = 'tqc/';
    pathFailed = 'failed/';
}

//setup static content for express
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

//Rest Service for Hongkong folder
app.get('/hongkong', function(req, res) {
    var directories = myfs.fetchDirectories(pathHK);
    res.json(directories);
});

//Rest Service for Taiwan folder
app.get('/taiwan', function(req, res) {
    var directories = myfs.fetchDirectories(pathTW);
    res.json(directories);
});

//Rest Service for Full QC folder
app.get('/fullqc', function(req, res) {
    var directories = myfs.fetchDirectories(pathFullQC);
    res.json(directories);
});

//Rest Service for Outsource Dubbed folder
app.get('/dubbed', function(req, res) {
    var directories = myfs.fetchDirectories(pathDubbed);
    res.json(directories);
});

//Rest Service for Outsource Mixed folder
app.get('/mixed', function(req, res) {
    var directories = myfs.fetchDirectories(pathMixed);
    res.json(directories);
});

//Rest Service for TQC folder
app.get('/tqc', function(req, res) {
    var directories = myfs.fetchDirectories(pathTQC);
    res.json(directories);
});

//Rest Service for Failed folder
app.get('/failed', function(req, res) {
    var directories = myfs.fetchDirectories(pathFailed);
    res.json(directories);
});



function createNext(path) {
    return function(err) {
        if (err) return console.log('watch failed on', path, 'with error', err)
        console.log('watch successful on', path)
    };
}

//Function Listener for watchr module
function listener(changeType, fullPath, currentStat, previousStat) {
    switch (changeType) {
        case 'update':
            console.log('the file', fullPath, 'was updated', currentStat, previousStat);
            io.emit('file update', fullPath);
            break
        case 'create':
            console.log('the file', fullPath, 'was created', currentStat);
            io.emit('file create', fullPath);
            break
        case 'delete':
            console.log('the file', fullPath, 'was deleted', previousStat);
            io.emit('file delete', fullPath);
            break
    }
}


//initial socket io server
io.on('connection', function(socket) {
    console.log('client connected');


    var stalkerHK = watcher.open(pathHK, listener, createNext(pathHK));
    var stalkerTW = watcher.open(pathTW, listener, createNext(pathTW));
    var stalkerFullQC = watcher.open(pathFullQC, listener, createNext(pathFullQC));
    var stalkerDubbed = watcher.open(pathDubbed, listener, createNext(pathDubbed));
    var stalkerMixed = watcher.open(pathMixed, listener, createNext(pathMixed));
    var stalkerTQC = watcher.open(pathTQC, listener, createNext(pathTQC));
    var stalkerFail = watcher.open(pathFailed, listener, createNext(pathFailed));


    socket.on('disconnect', function() {
        console.log('user disconnected');
        stalkerHK.close();
        stalkerTW.close();
        stalkerFullQC.close();
        stalkerDubbed.close();
        stalkerMixed.close();
        stalkerTQC.close();
        stalkerFail.close();
    });
});


//Code for http server
http.listen(3000, function() {
    console.log('listening to port 3000');
});
