/**
 * Created by GwonHyeok on 2016. 12. 5..
 */
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.render('index'));

module.exports = router;