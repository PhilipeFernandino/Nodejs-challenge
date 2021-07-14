const express = require('express');
const { errors } = require('celebrate');
const router = require('./router.js');
const path = require('path');
const app = express();
require('dotenv/config');
require('./models/index.js')();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(errors());

const port = process.env.PORT || '3031';
app.listen(port, (error) => {
    if (error) console.log(error);
    else console.log(`Servidor inicializado na porta ${port}!`);
});
