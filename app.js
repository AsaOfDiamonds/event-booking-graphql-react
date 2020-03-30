// ended #3 0:0:51
// for reference  


const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res, next) => {

    res.send('Hello World!');

});

app.listen(1337);
