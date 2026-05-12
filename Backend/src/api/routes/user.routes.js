const {
  getAllUsers,
  registerUser,
  loginUser,
  deleteUser,
  changeUserRole,
  updateUser,
  getUser,
  resetPassword,
  getUserGarden,
  removeUserPlant,
  waterUserPlant,
  addCustomPlantToGarden,
} = require('../controllers/user.controller')
const { auth } = require('../../middlewares/auth');
const { upload } = require('../../middlewares/img');

const userRouter = require('express').Router();

userRouter.get('/', auth('admin'), getAllUsers);
userRouter.post('/register', upload.single("image"), registerUser);
userRouter.post('/login', loginUser);
userRouter.put('/reset-password', resetPassword);
userRouter.get('/me/garden', auth(), getUserGarden);
userRouter.post('/me/garden/custom', auth(), upload.single('image'), addCustomPlantToGarden);
userRouter.delete('/me/garden/:entryId', auth(), removeUserPlant);
userRouter.put('/me/garden/:entryId/water', auth(), waterUserPlant);
userRouter.delete('/:id', auth(), deleteUser);
userRouter.put('/changeRole/:id', auth('admin'), changeUserRole);
userRouter.put('/:id', auth(), upload.single("image"), updateUser);
userRouter.get('/:id', getUser);

module.exports = userRouter;