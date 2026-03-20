const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, requireRole } = require('../middleware/auth');

// Asumiendo que el ID del Rol Admin en tu DB es 1
const ROLE_ADMIN = 1;

router.use(verifyToken);
router.use(requireRole([ROLE_ADMIN]));

router.get('/users', adminController.getUsers);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;