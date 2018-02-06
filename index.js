var app = require('express')();
var fileUpload = require('express-fileupload');
var mongoose = require('mongoose');

var server = require('http').Server(app);

app.use(fileUpload());

server.listen(80);

var mongoDB = 'mongodb://user:pass@ds225078.mlab.com:25078/csvimport';
mongoose.connect(mongoDB, {
  useMongoClient: true
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var Country = require('./country');
app.get('/something', function(req, res){
  Country.find(function(err, countries){
    res.send(countries);
  });
});
/* 
//finds all USA valuues and removes _id field
Country.find({'name': 'USA'},'-_id name year nominalGDP',function(err,docs){
  if (err)
      console.log('error occured in the database');
   console.log(docs);
}); 
 */
//finds all USA and China names and nominalGDP and renames nominalGDP as y
Country.aggregate([
  {
    $match: {
      name: { $in: ["USA", "China"]}
    }
  },
  {
    $project: {
      _id: 0,
      name: 1,
      year: 1,
      'y' : '$nominalGDP'
    }
  }
], function(err, recs){
  if(err){
    console.log(err);
  } else {
    console.log(recs);
  }
});
/* 
//finds one USA row and returns it, but does not specify which
Country.findOne({'name':'USA'}, 'name year nominalGDP', function(err,country){
  if (err) return handleError(err);
  console.log('%s %s %s', country.name, country.year, country.nominalGDP);
});
//finds one USA row of year 2017
Country.findOne({'name':'USA', 'year':'2017'}, 'name year population', function(err,country){
  if (err) return handleError(err);
  console.log('%s %s %s', country.name, country.year, country.population);
});
 */
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

var template = require('./template.js');
app.get('/template', template.get);

var upload = require('./upload.js');
app.post('/', upload.post);