import OrderLine from '../../models/orderline'
import OrderLineService from '../../services/orderline'
import connect, { MongodHelper } from '../db-helper'

const nonExistingOrderLineId = '5e57b77b5744fa0b461c7906'

//! Insert existing productId in order to test or create a product here
  
const existingProductId = '624d6650999c5954c9e9e4be '

async function createOrderLine() {
  const orderLine = new OrderLine({
    productId: existingProductId,
    quantity: 4,
    price: 50,
  })
  return await OrderLineService.createOrderLine(orderLine)
}

describe('orderLine service', () => {
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

  it('should create a orderLine', async () => {
    const orderLine = await createOrderLine()
    expect(orderLine).toHaveProperty('_id')
    expect(orderLine).toHaveProperty('productId')
    expect(orderLine).toHaveProperty('quantity')
    expect(orderLine).toHaveProperty('price')
  })

  it('should get a orderLine with id', async () => {
    const orderLine = await createOrderLine()
    const found = await OrderLineService.findById(orderLine._id)
    expect(found._id).toEqual(orderLine._id)
    expect(found.productId).toEqual(orderLine.productId)

  })

  // Check https://jestjs.io/docs/en/asynchronous for more info about
  // how to test async code, especially with error
  it('should not get a non-existing orderLine', async () => {
    expect.assertions(1)
    return OrderLineService.findById(nonExistingOrderLineId).catch((e) => {
      expect(e.message).toMatch(`OrderLine ${nonExistingOrderLineId} not found`)
    })
  })

  it('should update an existing orderLine', async () => {
    const orderLine = await createOrderLine()
    const update = {
      price: 1.99
    }
    const updated = await OrderLineService.updateById(orderLine._id, update)
    expect(updated).toHaveProperty('_id', orderLine._id)
    expect(updated).toHaveProperty('price', update.price)
  })

  it('should not update a non-existing orderLine', async () => {
    expect.assertions(1)
    const update = {
      quantity:123
    }

    return await OrderLineService.updateById(nonExistingOrderLineId, update).catch(
      (e) => {
        expect(e.message).toMatch(`OrderLine ${nonExistingOrderLineId} not found`)
      }
    )
  })

  it('should delete an existing orderLine', async () => {
    expect.assertions(1)
    const orderLine = await createOrderLine()
    await OrderLineService.deleteById(orderLine._id)
    return await OrderLineService.findById(orderLine._id).catch((e) => {
      expect(e.message).toBe(`OrderLine ${orderLine._id} not found`)
    })
  })

  it('should not delete a non-existing orderLine', async () => {
    expect.assertions(1)
    return await OrderLineService.deleteById(nonExistingOrderLineId).catch((e) => {
      expect(e.message).toBe(`OrderLine ${nonExistingOrderLineId} not found`)
    })
  })
})
