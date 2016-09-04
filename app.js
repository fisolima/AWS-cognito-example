
var express = require('express');
var app = express();
var EJS  = require('ejs');
var path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', EJS.renderFile);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./controllers/homeController'));


app.listen(3000, () => {
	console.log('Application stater at 3000');
});

module.exports = app;