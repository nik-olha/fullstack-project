import express from 'express'

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
router.get('/', findAll)
router.get('/:userId', findById)
router.put('/:userId', updateUser)
router.delete('/:userId', deleteUser)
router.post('/create', createUser)
router.post('/login', loginUser)
router.patch('/:userId/flowers/:flowerId', addFlowers)

export default router