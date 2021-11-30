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
    let iNotice = 0, iWarning = 0, iError = 0, iAll = 0;

    if (req.query.websiteurl) {
        try{
            const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});

            await pa11y(req.query.websiteurl, {
                browser: browser,
                includeNotices: true,
                includeWarnings: true
            }).then(results => {
                results.issues.forEach((element) => {
                    switch(parseInt(element.typeCode)){
                        case 3:
                            iNotice += 1;
                            break;
                        case 2:
                            iWarning += 1;
                            break;
                        case 1:
                            iError += 1;
                            break;
                        default:
                            break;
                    }
                    iAll += 1;
                });
                res.render('accessibility', {name: req.query.websiteurl, result: results, url: formurl, notices: iNotice, warnings: iWarning, errors: iError, count_all: iAll});
            });
        } catch(error){
            res.render('error', {name: req.query.websiteurl, message: error, url: formurl, notices: iNotice, warnings: iWarning, errors: iError, count_all: iAll});
        }
    } else {
        res.render('accessibility', {name: '', result: '', url: formurl, notices: iNotice, warnings: iWarning, errors: iError, count_all: iAll});
    }
});

app.get('/api/', async function (req, res) {
    const formurl = 'https://' + req.headers.host;
    let result = {name: '', issues: [], url: formurl};

    if (req.query.websiteurl) {
        try{
            const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});

            await pa11y(req.query.websiteurl, {
                browser: browser,
                includeNotices: false,
                includeWarnings: false
            }).then(results => {
                res.setHeader('Content-Type', 'application/json');

                result.name = req.query.websiteurl;
                result.issues = results.issues;

                res.render('api', {result: JSON.stringify(result), layout: 'api'});
            });
        } catch(error){
            res.render('error', {name: req.query.websiteurl, message: error, url: formurl});
        }
    } else {
        res.setHeader('Content-Type', 'application/json');
        res.render('api', {result: JSON.stringify(result), layout: 'api'});
    }
});

/*** listen ***/
app.listen(app.get('port'),  function () {
    console.log('Hello express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.' );
});