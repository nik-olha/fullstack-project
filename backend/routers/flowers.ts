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
router.get('/:flowerId', findById)
router.put('/:flowerId', updateFlower)
router.delete('/:flowerId', deleteFlower)
router.post('/create', createFlower)

export default router