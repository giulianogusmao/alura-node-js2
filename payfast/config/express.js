const express = require('express');
const consign = require('consign');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const morgan = require('morgan');
var logger = require('../services/loggerService');


module.exports = function () {
    const app = express();

    app.use(morgan("common", {
        stream: {
            write: function (mensagem) {
                logger.info(mensagem);
            }
        }
    }));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.use(expressValidator());

    consign()
        .include('services')
        .then('controllers')
        .then('routes')
        .then('models')
        .into(app);

    return app;
}
