import express from 'express'
import passport from 'passport'
import {
  createUser,
  findById,
  deleteUser,
  findAll,
  updateUser,
  addFlowers,
  loginUser,
} from '../controllers/user'

const router = express.Router()

// Every path we define here will get /user
router.get('/', passport.authenticate('jwt',{session:false}), findAll)
router.get('/:userId', findById)
router.put('/:userId', updateUser)
router.delete('/:userId', deleteUser)
router.post('/create', createUser)
router.post('/login', loginUser)
router.patch('/:userId/flowers/:flowerId', addFlowers)

export default router
