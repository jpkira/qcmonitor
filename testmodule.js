var myfs = require('./myfs');
var fs = require('fs');

var directories = myfs.fetchDirectories('sample/');
console.log(directories);

/*
fs.readdir('sample/', function(err, files){
	if(err) return;

	files.forEach(function(f){
		console.log(f);
	});
});
*/