const express = require('express');
const authController = require('./../controllers/authController');
const {
  getAllUsers,
  getUser,
  patchUser,
  deleteUser,
  updateCurrentUser,
  deleteCurrentUser,
} = require('../controllers/userController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.patch(
  '/updatepassword',
  authController.protect,
  authController.updatePassword
);
router.patch('/updatecurrentuser', authController.protect, updateCurrentUser);
router.delete('/deletecurrentuser', authController.protect, deleteCurrentUser);

router.post('/forgotpassword', authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);

router.route('/').get(getAllUsers); //.post(createUser);
router.route('/:id').get(getUser).patch(patchUser).delete(deleteUser);

module.exports = router;
