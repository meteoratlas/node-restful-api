const express = require('express');
const authController = require('./../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.get(
  '/me',
  authController.protect,
  userController.getMe,
  userController.getUser
);

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.patch(
  '/updatepassword',
  authController.protect,
  authController.updatePassword
);
router.patch(
  '/updatecurrentuser',
  authController.protect,
  userController.updateCurrentUser
);
router.delete(
  '/deletecurrentuser',
  authController.protect,
  userController.deleteCurrentUser
);

router.post('/forgotpassword', authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);

router.route('/').get(userController.getAllUsers); //.post(createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.patchUser)
  .delete(userController.deleteUser);

module.exports = router;
