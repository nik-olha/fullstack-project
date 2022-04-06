import express from 'express'

import {
  createFlower,
  findById,
  deleteFlower,
  findAll,
  updateFlower,
} from '../controllers/flowers'

const router = express.Router()

// Every path we define here will get /flowers
router.get('/', findAll)
router.get('/:userId', findById)
router.put('/:userId', updateFlower)
router.delete('/:userId', deleteFlower)
router.post('/create', createFlower)

export default router