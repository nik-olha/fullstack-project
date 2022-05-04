import { Router } from 'express'
import {
  createOrderLine,
  deleteOrderLineById,
  findOrderLineById,
  updateOrderLineById,
} from '../controllers/orderline'

const router = Router()

router.post('/:productId', createOrderLine)
router.get('/:orderLineId', findOrderLineById)
router.put('/:orderLineId', updateOrderLineById)
router.delete('/:orderLineId', deleteOrderLineById)

export default router
