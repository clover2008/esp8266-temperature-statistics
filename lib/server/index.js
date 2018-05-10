const path = require('path');
const config = require('../../config/config.json');
const express = require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const routes = require('./routes');
const logger = require('../utils/logger');

class Server {

  constructor(options) {
    this.options = options || {};
    this.server = express();
    this._initServer();
  }

  _initServer() {
    nunjucks.configure(path.join(__dirname, '../../views'), {
      autoescape: config.nunjucks.autoescape || true,
      express: this.server,
    });
    // this.server.set('views', path.join(__dirname, '../../views'));
    this.server.set('view engine', 'njk');
    this.server.use(`/static`, express.static(`${ __dirname }/../../public`));
    this.server.use(bodyParser.json());
    this.server.use(bodyParser.urlencoded({ extended: true }));

    this.server.use('/', routes);

    this.server.all('**', (req, res) => {
      res.render('not-found');
    });
    this.server.use((err, req, res, next) => {
      if(!err) {
        return next();
      } else {
        logger.error(err);
        res.render('error');
      }
    });
  }

  start(port, callback) {
    this.server.listen(port, callback);
  }

}

module.exports = Server;