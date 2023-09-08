const path = require('path');
const express = require('express');
const jsforce = require('jsforce');

const app = express();

let viewsPath = path.join(__dirname, 'views');

// this gives current directory
console.log('dirname', __dirname);

console.log('viewsPath', viewsPath);

const port = 4200;


app.get("/", (req, res) =>{
    res.status(200).sendFile(`${viewsPath}/index.html`);
});

app.get("/contact", (req, res) =>{
    // res.send("Welcome to contact page");
    res.status(200).sendFile(`${viewsPath}/contact.html`);
});

app.get('/connect', (req, res) => {
    const oauth2 = new jsforce.OAuth2({
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET_ID,
        // loginUrl: '',
        // redirectUri: `${req.protocol}://${req.get('host')}/${process.env.REDIRECT_URI}`
        redirectUri: `${req.protocol}://${req.get('host')}`
    });
    res.redirect(oauth2.getAuthorizationUrl({}));

});

app.post('/connect', (req, res) => {

});


app.listen(port, ()=>{
    console.log(`app running on http://localhost:${port}`);
})