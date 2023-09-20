const path = require('path');
const express = require('express');
const jsforce = require('jsforce');
// const cors = require("cors");

const helper = require('./views/helper');

const app = express();
// app.use(cors());
app.use(express.json());       
app.use(express.urlencoded({extended: true})); 

let viewsPath = path.join(__dirname, 'views');
const port = 4200;
const oAuthdataObj = {
    clientId: '',
    clientSecret: '',
    redirectUri: '',
    loginUrl: ''
};

var instanceUrl, accessToken = '';

app.get("/", (req, res) =>{
    res.status(200).sendFile(`${viewsPath}/index.html`);
});

app.get("/contact", (req, res) =>{
    // res.send("Welcome to contact page");
    console.log('auth');
        res.status(200).sendFile(`${viewsPath}/contact.html`);
});

app.get('/connect', (req, res) => {
    const a = helper.oAuthdata();
    
    let oAuthdata = oAuthdataObj;
    oAuthdata.clientId = a.CLIENT_ID;
    oAuthdata.clientSecret = a.CLIENT_SECRET_ID;
    oAuthdata.redirectUri = `${req.protocol}://${req.get('host')}/${a.callbackPath}`;
    
    console.log('oauth data', oAuthdata);

    let oauth2 = new jsforce.OAuth2(oAuthdata);
    res.redirect(oauth2.getAuthorizationUrl({}));

});

app.get('/connectCont', (req, res) => {
    const a = helper.oAuthdata();
    
    let oAuthdata = oAuthdataObj;
    oAuthdata.clientId = a.CLIENT_ID;
    oAuthdata.clientSecret = a.CLIENT_SECRET_ID;
    oAuthdata.redirectUri = `${req.protocol}://${req.get('host')}/${a.callbackPath}`;

    const conn = new jsforce.Connection({ oauth2 : oAuthdata });
    conn.authorize(req.query.code, function(err, userInfo) {
        if (err) {
            return console.error(err);
        }
        console.log(conn.accessToken, conn.instanceUrl); // access token via oauth2
        instanceUrl = conn.instanceUrl;
        accessToken = conn.accessToken;

    });
    res.redirect('/dashboard'); 
    
});


app.get('/dashboard', (req, res) => {
    res.status(200).send('<h1>Dashboard</h1>');
});

app.listen(port, ()=>{
    console.log(`app running on http://localhost:${port}`);
})