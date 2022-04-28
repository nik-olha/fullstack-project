import { Router } from 'express'
import {
  createOrder,
  deleteOrderById,
  findOrderById,
  findOrdersForUserId,
  updateOrderById,
} from '../controllers/order'

const router = Router()

router.post('/:userId', createOrder)
router.get('/:userId', findOrdersForUserId)
router.get('/:userId/:orderId', findOrderById)
router.put('/:userId/:orderId', updateOrderById)
router.delete('/:userId/:orderId', deleteOrderById)

export default router