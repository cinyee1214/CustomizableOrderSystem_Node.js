const express = require('express');
const app = express();
const configRoutes = require('./routes');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const exphbs = require('express-handlebars');

const static = express.static(__dirname + '/public');

app.use('/public', static);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs());

app.set('view engine', 'handlebars');

app.use(
    session({
        name: 'AuthCookie',
        secret: 'Some secret string!',
        resave: false,
        saveUninitialized: true,
    })
);

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});