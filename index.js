/*** requires ***/
const express = require('express');
const path = require('path');
const hbs = require('express-handlebars'); 
const bodyParser = require('body-parser');  
const url = require('url');  
const querystring = require('querystring');  
const pa11y = require('pa11y');
const puppeteer = require('puppeteer');

/*** config ***/
var app = express();
var options = {
    dotfiles: 'ignore',
    extensions: ['htm', 'html'],
    index: false
    };
app.use(express.static(path.join(__dirname, 'public'), options));
app.set('port', process.env.PORT || 3000);

/*** handlebars template engine ***/
app.engine('.hbs', hbs({
    extname: '.hbs', 
    defaultLayout: 'main',
    layoutsDir: 'views/layouts/',
    partialsDir: 'views/partials/'
})); 
app.set('view engine', '.hbs');

/*** routes ***/
app.get('/', async function (req, res) {
    const formurl = 'https://' + req.headers.host;

    if (req.query.websiteurl) {
        try{
            const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});

            await pa11y(req.query.websiteurl, {
                browser: browser,
                includeNotices: true,
                includeWarnings: true
            }).then(results => {
                res.render('accessibility', {name: req.query.websiteurl, result: results, url: formurl});
            });
        } catch(error){
            res.render('error', {name: req.query.websiteurl, message: error, url: formurl});
        }
    } else {
        res.render('accessibility', {name: '', result: '', url: formurl});
    }
});

/*** listen ***/
app.listen(app.get('port'),  function () {
    //console.log('Hello express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.' );
});