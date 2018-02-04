var csv = require('fast-csv');
var mongoose = require('mongoose');
var Author = require('./author');
//*fixed..this upload does not delete what is already inside db, need to implement drop feature

exports.post = function (req, res) {
	if (!req.files)
		return res.status(400).send('No files were uploaded.');
	
	var authorFile = req.files.file;

	var authors = [];
		
	csv
	 .fromString(authorFile.data.toString(), {
		 headers: true,
		 ignoreEmpty: true
	 })
	 .on("data", function(data){
		 data['_id'] = new mongoose.Types.ObjectId();
		 
		 authors.push(data);
	 })
	 .on("end", function(){
		//this removes documents only on first upload***
		//fixed! now removes documents on each
		Author.remove({}, function(err,removed) {

		});
		//db.Author.remove({});

		 Author.create(authors, function(err, documents) {
			if (err) throw err;
			
			res.send(authors.length + ' authors have been successfully uploaded.');
		 });
	 });
};