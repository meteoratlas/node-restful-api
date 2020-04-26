const express = require('express');
const authController = require('./../controllers/authController');
const {
  getAllUsers,
  createUser,
  getUser,
  patchUser,
  deleteUser,
} = require('../controllers/userController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotpassword', authController.forgotPassword);
router.post('/resetpassword', authController.resetPassword);

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(patchUser).delete(deleteUser);

module.exports = router;
