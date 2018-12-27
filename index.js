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
app.engine('handlebars', hbs({defaultLayout: 'main'})); 
app.set('view engine', 'handlebars');

/*** routes ***/
app.get('/', async function (req, res) {
    var formurl = 'http://' + req.headers.host;

    if (req.query.websiteurl) {
        try{
            const browser = await puppeteer.launch({
                ignoreHTTPSErrors: true,
                args: ['--no-sandbox']
            });

            await pa11y(req.query.websiteurl, {
                browser: browser
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
    console.log('Hello express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.' );
});