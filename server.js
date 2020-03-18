let path = require('path');
let express = require('express');
let cors = require('cors');

let app = express();

app.use('/', cors(), express.static(path.resolve(__dirname, 'public')));

app.listen(8080, (err) => {
    console.log(err || 'running at port 8080');
});