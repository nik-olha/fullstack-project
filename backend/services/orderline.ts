import OrderLine, { OrderLineDocument } from '../models/orderline'
import { NotFoundError } from '../helpers/apiError'

const createOrderLine = async (
  orderLine: OrderLineDocument
): Promise<OrderLineDocument> => {
  const returnOrderLine = await orderLine.save()
  return returnOrderLine.populate('productId').execPopulate()
}

const findById = async (orderLineId: string): Promise<OrderLineDocument> => {
  const orderLineToReturn = await OrderLine.findById(orderLineId).populate(
    'productId'
  )
  if (!orderLineToReturn) {
    throw new NotFoundError(`OrderLine ${orderLineId} not found`)
  }
  return orderLineToReturn
}

const updateById = async (
  orderLineId: string,
  propsToUpdate: Partial<OrderLineDocument>
): Promise<OrderLineDocument | null> => {
  const orderLineToUpdate = await OrderLine.findByIdAndUpdate(
    orderLineId,
    propsToUpdate,
    {
      new: true,
    }
  ).populate('productId')
  if (!orderLineToUpdate) {
    throw new NotFoundError(`OrderLine ${orderLineId} not found`)
  }
  return orderLineToUpdate
}

const deleteById = async (orderLineId: string): Promise<void> => {
  const orderLineToDelete = await OrderLine.findByIdAndDelete(orderLineId)
  if (!orderLineToDelete) {
    throw new NotFoundError(`OrderLine ${orderLineId} not found`)
  }
}

export default {
  createOrderLine,
  findById,
  updateById,
  deleteById,
}