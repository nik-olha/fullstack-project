import Order, { OrderDocument } from '../models/Order'
import { BadRequestError, NotFoundError } from '../helpers/apiError'

const createOrder = async (order: OrderDocument): Promise<OrderDocument> => {
  return await order.save()
}

const findOrdersForUserId = async (
  userId: string
): Promise<OrderDocument[]> => {
  const ordersToReturn = await Order.find({ userId: userId })
    .sort({ _id: 1 })
    .populate({ path: 'userId', select: '-password' })
    .populate({
      path: 'orderedlines',
      populate: { path: 'productId', model: 'Product' },
    })
  return ordersToReturn
}

const findOrderById = async (
  userId: string,
  orderId: string
): Promise<OrderDocument> => {
  const orderToReturn = await Order.findById(orderId)
  if (!orderToReturn) {
    throw new NotFoundError(`Order ${orderId} not found`)
  }
  if (orderToReturn.userId != userId) {
    throw new BadRequestError(
      `Order ${orderId} is not made by this user ${userId}`
    )
  }
  return orderToReturn
}

const updateOrderById = async (
  userId: string,
  orderId: string,
  propsToUpdate: Partial<OrderDocument>
): Promise<OrderDocument | null> => {
  const IsOrderMadeBy = await findOrderById(userId, orderId)
  const orderToUpdate = await Order.findByIdAndUpdate(
    IsOrderMadeBy._id,
    propsToUpdate,
    {
      new: true,
    }
  )
  return orderToUpdate
}

const deleteOrderById = async (
  userId: string,
  orderId: string
): Promise<void> => {
  const IsOrderMadeBy = await findOrderById(userId, orderId)
  await Order.findByIdAndDelete(IsOrderMadeBy._id)
}

export default {
  createOrder,
  findOrdersForUserId,
  findOrderById,
  updateOrderById,
  deleteOrderById,
}
