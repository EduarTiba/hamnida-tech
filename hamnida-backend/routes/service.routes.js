const express = require('express');
const router = express.Router();
const {
  createService,
  getAllServices,
  updateService,
  deleteService
} = require('../controllers/service.controller');

const verifyToken = require('../middleware/auth.middleware');

router.post('/', verifyToken, createService);      // protegido
router.get('/', getAllServices);                   // público
router.put('/:id', verifyToken, updateService);    // protegido
router.delete('/:id', verifyToken, deleteService); // protegido

module.exports = router;
