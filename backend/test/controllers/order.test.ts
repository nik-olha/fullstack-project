import request from 'supertest'
import app from '../../app'
import connect, { MongodHelper } from '../db-helper'
import { OrderDocument } from '../../models/order'

const nonExistingOrderId = '5e57b77b5744fa0b461c7906'
const nonExistingUserId = '5e57b77b5744fa0b461c7906'

const existingUserId = '6229f9524f07b73d003e72f4'
const existingOrderLineId = '6229f8df4f07b73d003e72eb'

async function createOrder(override?: Partial<OrderDocument>) {
  let order = {
    orderLines: [
      { _id: existingOrderLineId },
      { _id: existingOrderLineId }],
    totalPrice: 123.0,
  }

  if (override) {
    order = { ...order, ...override }
  }

  return await request(app).post(`/orders/${existingUserId}`).send(order)
}

describe('order controller', () => {
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
    const res = await createOrder()
    expect(res.status).toBe(200)
    expect(res.body.userId).toEqual(existingUserId)
    expect(res.body.totalPrice).toEqual(123.0)
  })

  // it('should not create a order with wrong data', async () => {
  //   const res = await request(app)
  //     .post(`/orders/${nonExistingUserId}`)
  //     .send({
  //       orderLines: [
  //         { _id: existingOrderLineId },
  //         { _id: existingOrderLineId },
  //       ],
  //       totalPrice: 123.0,
  //       // These fields should be included
  //       // userId: existingUserId
  //     })
  //   expect(res.status).toBe(400)
  // })

  it('should get back an existing order', async () => {
    let res = await createOrder()
    expect(res.status).toBe(200)

    const orderId = res.body._id
    res = await request(app).get(`/orders/${existingUserId}/${orderId}`)

    expect(res.body._id).toEqual(orderId)
  })

  it('should not get back a non-existing order', async () => {
    const res = await request(app).get(`/orders/${existingUserId}/${nonExistingOrderId}`)
    expect(res.status).toBe(404)
  })

  it('should not get a existing order with non-existing user', async () => {
    const res1 = await createOrder({
      userId: existingUserId,
      //    orderLines: [],
      totalPrice: 1231,
    })
    const res = await request(app).get(
      `/orders/${nonExistingUserId}/${res1.body._id}`
    )
    expect(res.status).toBe(400)
  })

  it('should get back all order', async () => {
    const res1 = await createOrder({
      userId: existingUserId,
      //   orderLines: [],
      totalPrice: 1231
    })
    const res2 = await createOrder({
      userId: existingUserId,
      //   orderLines: [],
      totalPrice: 1231,
    })

    const res3 = await request(app).get(`/orders/${existingUserId}`)
    expect(res3.body.length).toEqual(2)
    expect(res3.body[0]._id).toEqual(res1.body._id)
    expect(res3.body[1]._id).toEqual(res2.body._id)
  })

  it('should update an existing order', async () => {
    let res = await createOrder()
    expect(res.status).toBe(200)
    const orderId = res.body._id
    const update = {
      totalPrice: 9991,
    }
    res = await request(app)
      .put(`/orders/${existingUserId}/${orderId}`)
      .send(update)
    expect(res.status).toEqual(200)
    expect(res.body.totalPrice).toEqual(9991)
  })

  it('should delete an existing order', async () => {
    let res = await createOrder()
    expect(res.status).toBe(200)
    const orderId = res.body._id
    res = await request(app).delete(
      `/orders/${existingUserId}/${orderId}`
    )
    expect(res.status).toEqual(204)
    res = await request(app).get(`/orders/${existingUserId}/${orderId}`)
    expect(res.status).toBe(404)
  })
})
