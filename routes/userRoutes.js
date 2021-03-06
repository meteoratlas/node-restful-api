const express = require('express');
const authController = require('./../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotpassword', authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);

// All following routes after this middleware require authentication
router.use(authController.protect);

router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/updatecurrentuser',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateCurrentUser
);

router.patch('/updatepassword', authController.updatePassword);

router.delete('/deletecurrentuser', userController.deleteCurrentUser);

router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllUsers); //.post(createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.patchUser)
  .delete(userController.deleteUser);

module.exports = router;
