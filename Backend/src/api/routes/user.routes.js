const {
  getAllUsers,
  registerUser,
  loginUser,
  deleteUser,
  changeUserRole,
  updateUser,
  getUser
} = require('../controllers/user.controller')
const { auth } = require('../../middlewares/auth');
const { upload } = require('../../middlewares/img');

const userRouter = require('express').Router();

userRouter.get('/', auth('admin'), getAllUsers);
userRouter.post('/register', upload.single("image"), registerUser);
userRouter.post('/login', loginUser);
userRouter.delete('/:id', auth(),  deleteUser);
userRouter.put('/changeRole/:id', auth('admin'), changeUserRole);
userRouter.put('/:id', auth(), upload.single("image"), updateUser);
userRouter.get('/:id', getUser);

module.exports = userRouter;