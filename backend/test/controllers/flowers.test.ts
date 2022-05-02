import request from 'supertest'

import { FlowerDocument } from '../../models/flowers'
import app from '../../app'
import connect, { MongodHelper } from '../db-helper'

const nonExistingFlowerId = '5e57b77b5744fa0b461c7906'

async function createFlower(override?: Partial<FlowerDocument>) {
  let flower = {
    name: 'White parrot',
    price: 2,
    color: 'White',
    description: 'For extra fun',
    instock: 50,
    imageURL: 'No image attached',
  }

  if (override) {
    flower = { ...flower, ...override }
  }

  return await request(app).post('/flowers/create').send(flower)
}

describe('flower controller', () => {
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

  it('should create a flower', async () => {
    const res = await createFlower()
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('_id')
    expect(res.body.name).toBe('White parrot')
  })

  it('should not create a flower with wrong data', async () => {
    const res = await request(app)
      .post('/flowers/create')
      .send({
        name: 'White parrot',
        price: 0,
        color: 'White',
        description: 'For extra fun',
        instock: 50,
        imageURL: 'No image attached',
      })
    expect(res.status).toBe(400)
  })

  it('should get back an existing flower', async () => {
    let res = await createFlower()
    expect(res.status).toBe(200)

    const flowerId = res.body._id
    res = await request(app).get(`/flowers/${flowerId}`)

    expect(res.body._id).toEqual(flowerId)
  })

  it('should not get back a non-existing flower', async () => {
    const res = await request(app).get(`/flowers/${nonExistingFlowerId}`)
    expect(res.status).toBe(404)
  })

  it('should get back all flowers', async () => {
    const res1 = await createFlower({
      name: 'Black parrot',
      price: 1,
    })
    const res2 = await createFlower({
      name: 'White parrot',
      price: 2,
    })

    const res3 = await request(app).get('/flowers')

    expect(res3.body.length).toEqual(2)
    expect(res3.body[0]._id).toEqual(res1.body._id)
    expect(res3.body[1]._id).toEqual(res2.body._id)
  })

  it('should update an existing flower', async () => {
    let res = await createFlower()
    expect(res.status).toBe(200)

    const flowerId = res.body._id
    const update = {
      name: 'Black parrot',
      price: 4,
    }

    res = await request(app).put(`/flowers/${flowerId}`).send(update)
    expect(res.status).toBe(200)
    
    expect(res.body.name).toEqual('Black parrot')
    expect(res.body.price).toEqual(4)
  })

  it('should delete an existing flower', async () => {
    let res = await createFlower()
    expect(res.status).toBe(200)
    const flowerId = res.body._id

    res = await request(app).delete(`/flowers/${flowerId}`)

    expect(res.status).toEqual(204)

    res = await request(app).get(`/flowers/${flowerId}`)
    expect(res.status).toBe(404)
  })
})
