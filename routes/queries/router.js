const express = require('express');
const router = express.Router();

const {q1, q3a, getProductSchema} = require('./validations');
const {query1, query1a, question30 } = require('./controller');

router.get('/1', query1);
router.get('/1a', query1a);
router.get('/30', question30);

module.exports = router;