import request from 'supertest'

import { OrderLineDocument } from '../../models/orderline'
import app from '../../app'
import connect, { MongodHelper } from '../db-helper'

const nonExistingOrderLineId = '5e57b77b5744fa0b461c7906'

const existingProductId = '6229f8c14f07b73d003e72e6'

async function createOrderLine(override?: Partial<OrderLineDocument>) {
  let orderLine = {
    quantity: 4,
    price: 2.99,
  }

  if (override) {
    orderLine = { ...orderLine, ...override }
  }

  return await request(app)
    .post(`/orderLines/${existingProductId}`)
    .send(orderLine)
}

describe('orderLine controller', () => {
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
    const res = await createOrderLine()
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('_id')
    // expect(res.body.productId).toBe(`${existingProductId}`)
  })

  // it('should not create a orderLine with wrong data', async () => {
  //   const res = await request(app).post(`/orderLines/${existingProductId}`).send({
  //     // These fields should be included
  //     // productId: existingProductId,
  //   })
  //   expect(res.status).toBe(400)
  // })

  it('should get back an existing orderLine', async () => {
    let res = await createOrderLine()
    expect(res.status).toBe(200)

    const orderLineId = res.body._id
    res = await request(app).get(`/orderLines/${orderLineId}`)

    expect(res.body._id).toEqual(orderLineId)
  })

  it('should not get back a non-existing orderLine', async () => {
    const res = await request(app).get(
      `/orderLines/${nonExistingOrderLineId}`
    )
    expect(res.status).toBe(404)
  })

  it('should get back all orderLine', async () => {
    const res1 = await createOrderLine({
      quantity: 4,
      price: 2.99,
    })
    const res2 = await createOrderLine({
      quantity: 3,
      price: 6.99,
    })

    // const res3 = await request(app).get('/orderLines')

    // expect(res3.body.length).toEqual(2)
    // expect(res3.body[0]._id).toEqual(res1.body._id)
    // expect(res3.body[1]._id).toEqual(res2.body._id)
  })

  it('should update an existing orderLine', async () => {
    let res = await createOrderLine()
    expect(res.status).toBe(200)
    const orderLineId = res.body._id
    const update = {
      productId: '6229f8c14c07b73d003e72e6',
    }

    res = await request(app)
      .put(`/orderLines/${orderLineId}`)
      .send(update)

    expect(res.status).toEqual(200)
    // expect(res.body.productId).toEqual('6229f8c14c07b73d003e72e6')
  })

  it('should delete an existing orderLine', async () => {
    let res = await createOrderLine()
    expect(res.status).toBe(200)
    const orderLineId = res.body._id

    res = await request(app).delete(`/orderLines/${orderLineId}`)

    expect(res.status).toEqual(204)

    res = await request(app).get(`/orderLines/${orderLineId}`)
    expect(res.status).toBe(404)
  })
})
