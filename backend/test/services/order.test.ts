import Order from '../../models/order'
import OrderService from '../../services/order'
import connect, { MongodHelper } from '../db-helper'

const nonExistingOrderId = '5e57b77b5744fa0b461c7906'
const nonExistingUserId = '5e57b77b5744fa0b461c7906'
const existingUserId = '6229f9524f07b73d003e72f4'
const existingOrderLineId = '6229f8df4f07b73d003e72eb'


async function createOrder() {
  const order = new Order({
    userId: existingUserId,
    orderLines: [
      { _id: existingOrderLineId },
      { _id: existingOrderLineId }
    ],
    totalPrice: 1233
  })
  return await OrderService.createOrder(order)
}

describe('order service', () => {
  let mongodHelper: MongodHelper

  beforeAll(async () => {
    mongodHelper = await connect()
  })

  afterEach(async () => {
    await mongodHelper.clearDatabase()
  })

  afterAll(async () => {
    await mongodHelper.closeDatabase()
  })

  it('should create a order', async () => {
    const order = await createOrder()
    expect(order).toHaveProperty('_id')
    expect(order).toHaveProperty('userId')
    expect(order).toHaveProperty('totalPrice')
  })

  it('should get a order with id', async () => {
    const order = await createOrder()
    const found = await OrderService.findOrderById(existingUserId, order._id)
    expect(found._id).toEqual(order._id)
    expect(found.userId).toEqual(order.userId)
  })

  // Check https://jestjs.io/docs/en/asynchronous for more info about
  // how to test async code, especially with error
  it('should not get a non-existing order', async () => {
    expect.assertions(1)
    return await OrderService.findOrderById(existingUserId, nonExistingOrderId).catch((e) => {
      expect(e.message).toMatch(`Order ${nonExistingOrderId} not found`)
    })
  })

  it('should not get a existing order with non-existing user', async () => {
    const order = await createOrder()
    return await OrderService.findOrderById(nonExistingUserId, order._id).catch(
      (e) => {
        expect(e.message).toMatch(`Order ${order._id} is not made by this user ${nonExistingUserId}`)
      }
    )
  })

  it('should update an existing order', async () => {
    const order = await createOrder()
    const update = {
      totalPrice: 123421,
    }
    const updated = await OrderService.updateOrderById(
      existingUserId,
      order._id,
      update
    )
    expect(updated).toHaveProperty('_id', order._id)
    expect(updated).toHaveProperty('totalPrice', 123421)
  })

  it('should not update a non-existing order', async () => {
    expect.assertions(1)
    const update = {
      totalPrice: 9999,
    }

    return OrderService.updateOrderById(existingUserId, nonExistingOrderId, update).catch(
      (e) => {
        expect(e.message).toMatch(
          `Order ${nonExistingOrderId} not found`
        )
      }
    )
  })

  it('should not update a existing order with non-existing user', async () => {
    const order = await createOrder()
    const update = {
      totalPrice: 9999,
    }
    return OrderService.updateOrderById(
      nonExistingUserId,
      order._id,
      update
    ).catch((e) => {
      expect(e.message).toMatch(`Order ${order._id} is not made by this user ${nonExistingUserId}`)
    })
  })

  it('should delete an existing order', async () => {
    const order = await createOrder()
    await OrderService.deleteOrderById(existingUserId, order._id)
    return await OrderService.findOrderById(existingUserId, order._id).catch((e) => {
      expect(e.message).toBe(`Order ${order._id} not found`)
    })
  })

  // it('should not delete an non-existing order', async () => {

  //   return await OrderService.deleteOrderById(existingUserId, nonExistingOrderId).catch(
  //     (e) => {
  //       expect(e.message).toBe(`Order ${nonExistingOrderId} not found`)
  //     }
  //   )
  // })
})
