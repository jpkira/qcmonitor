var chai = require('chai');
var expect = chai.expect;
var myfs = require('./myfs');
var fs = require('fs');

describe('MyFS Test', function() {
	
	it('fetchDirectories() should return 0 length of items, if no directories are created', function () {
		var directories = myfs.fetchDirectories('sample/');
		expect(directories.length).to.equal(0);
	});
	

	it('fetchDirectories() should return 1 length of items, if a directory are created', function(){
		fs.mkdirSync('sample/f1');

		var directories = myfs.fetchDirectories('sample/');
		expect(directories.length).to.equal(1);
		
	});

	it('fetchDirectories() item retrieve name is f1 and 0 fileCount', function(){
		var directories = myfs.fetchDirectories('sample/');
		var fld1 = directories[0];
		expect(fld1.name).to.equal('f1');
		expect(fld1.fileCount).to.equal(0);
	});

	it('fetchDirectories() item retrieve name is f1 and 1 fileCount, after folder creation inside f1 folder', function(){
		fs.mkdirSync('sample/f1/f2');
		var directories = myfs.fetchDirectories('sample/');
		var fld1 = directories[0];
		expect(fld1.name).to.equal('f1');
		expect(fld1.fileCount).to.equal(1);
	});

});

after(function(){
	fs.rmdirSync('sample/f1/f2');
	fs.rmdirSync('sample/f1');
});

