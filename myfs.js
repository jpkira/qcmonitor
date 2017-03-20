var fs = require('fs');

/*
Module for checking the inside of the specified 
folder and counting the number of files
*/
module.exports = {
	fetchDirectories : function(path) {
		//read contents of path
		var directories = [];

		var files = fs.readdirSync(path);

		files.forEach(function(f) {
			var myfile = path + "/" + f;
			var cnt = fs.readdirSync(myfile);
			directories.push({
				name: f,
				fileCount: cnt.length
			});
		});

		return directories;
	}	
};




