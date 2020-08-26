const express = require('express');
const router = express.Router();



const ctrlPoint = require('../controllers/point');

router.post('/knn', ctrlPoint.getKNN);
router.post('/points', ctrlPoint.createPoint);
router.put('/points/:id', ctrlPoint.updatePoint);
router.get('/points/:id', ctrlPoint.getPoint);
router.get('/points', ctrlPoint.getPoints);
router.delete('/points/:id', ctrlPoint.deletePoint);

module.exports = router;