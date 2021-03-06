const express = require('express');
const moment = require('moment');
const logger = require('../../../utils/logger');
const TemperatureService = require('../../../services/temperature.service');

const router = express.Router();

function parseDate({ startTime=moment().startOf('day').toDate().getTime(), endTime=Date.now(), type='TIMESTAMP', format }) {
  let startDate, endDate;
  switch(type) {
    case 'TIMESTAMP': {
      startDate = new Date(+startTime);
      endDate = new Date(+endTime);
      break;
    }
    case 'FORMATTED': {
      startDate = moment(startTime, format).toDate();
      endDate = moment(endTime, format).toDate();
      break;
    }
    default: {
      throw new Error(`unknow date type ${ type }`);
    }
  }
  return { startDate, endDate };
}

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  // res.header("Content-Type", "application/json; charset=utf-8");
  next();
});

router.options('*', (req, res) => {
  res.status(204).send('');
});

router.get('/collection', (req, res) => {
  let { value, position='default' } = req.query;
  TemperatureService.save({ value, position }).then(data => {
    res.json({
      status: 0,
      data,
    });
  }).catch(err => {
    logger.error(err);
    res.json({
      status: 1, err,
    });
  });
});

router.post('/collection', (req, res) => {
  let { value, position } = req.body;
  TemperatureService.save({ value, position }).then(data => {
    res.json({
      status: 0,
      data,
    });
  }).catch(err => {
    logger.error(err);
    res.json({
      status: 1, err,
    });
  });
});

router.get('/list', (req, res) => {
  let { startTime=moment().startOf('day').toDate().getTime(), endTime=Date.now(), type='TIMESTAMP', format } = req.query;
  let { startDate, endDate } = parseDate({ startTime, endTime, type, format });
  TemperatureService.getList({ startDate, endDate }).then(({ count, rows }) => {
    res.json({
      status: 0,
      data: {
        count,
        list: rows,
      },
    });
  }).catch(err => {
    logger.error(err);
    res.json({
      status: -1,
      error: err
    });
  });
});

router.get('/latest', (req, res) => {
  TemperatureService.getLatest().then(data => {
    res.json({
      status: 0,
      data: data,
    })
  }).catch(err => {
    logger.error(err);
    res.json({
      status: 1,
      error: err,
    });
  });
});

router.get('/average', (req, res) => {
  let { startTime=moment().startOf('day').toDate().getTime(), endTime=Date.now(), type='TIMESTAMP', format } = req.query;
  let { startDate, endDate } = parseDate({ startTime, endTime, type, format });
  TemperatureService.getAverage({ startDate, endDate }).then((data) => {
    res.json({
      status: 0,
      data: data,
    });
  }).catch(err => {
    logger.error(err);
    res.json({
      status: 1,
      error: err,
    });
  });
});

router.get('/max', (req, res) => {
  let { startTime=moment().startOf('day').toDate().getTime(), endTime=Date.now(), type='TIMESTAMP', format } = req.query;
  let { startDate, endDate } = parseDate({ startTime, endTime, type, format });
  TemperatureService.getMax({ startDate, endDate }).then(({ list, count, value }) => {
    res.json({
      status: 0,
      data: { list, count, value },
    });
  }).catch(err => {
    logger.error(err);
    res.json({
      status: 1,
      error: err,
    });
  });
});

router.get('/min', (req, res) => {
  let { startTime=moment().startOf('day').toDate().getTime(), endTime=Date.now(), type='TIMESTAMP', format } = req.query;
  let { startDate, endDate } = parseDate({ startTime, endTime, type, format });
  TemperatureService.getMin({ startDate, endDate }).then((data) => {
    res.json({
      status: 0,
      data: data,
    });
  }).catch(err => {
    logger.error(err);
    res.json({
      status: 1,
      error: err,
    });
  });
});

router.get('/this-week-average', (req, res) => {
  TemperatureService.getAverageOfWeek().then((data) => {
    res.json({
      status: 0,
      data: data,
    });
  }).catch(err => {
    logger.error(err);
    res.json({
      status: 1,
      error: err,
    });
  });
});

module.exports = router;
