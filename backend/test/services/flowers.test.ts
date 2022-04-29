import Flower from '../../models/flowers'
import FlowerService from '../../services/flowers'
import connect, { MongodHelper } from '../db-helper'

const nonExistingFlowerId = '5e57b77b5744fa0b461c7906'

async function createFlower() {
  const flower = new Flower({
    name: 'Red head',
    price: 4,
    color: 'Red',
    description: 'For party',
    instock: 90,
    imageURL: 'Coming soon...',
  })
  return await FlowerService.create(flower)
}

describe('flower service', () => {
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
    const flower = await createFlower()
    expect(flower).toHaveProperty('_id')
    expect(flower).toHaveProperty('name', 'Red head')
    expect(flower).toHaveProperty('price', 90)
  })

  it('should get a flower with id', async () => {
    const flower = await createFlower()
    const found = await FlowerService.findById(flower._id)
    expect(found.name).toEqual(flower.name)
    expect(found._id).toEqual(flower._id)
  })

  // Check https://jestjs.io/docs/en/asynchronous for more info about
  // how to test async code, especially with error
  it('should not get a non-existing flower', async () => {
    expect.assertions(1)
    return FlowerService.findById(nonExistingFlowerId).catch((e) => {
      expect(e.message).toMatch(`Flower ${nonExistingFlowerId} not found`)
    })
  })

  it('should update an existing flower', async () => {
    const flower = await createFlower()
    const update = {
      name: 'Red head',
      price: 4,
    }
    const updated = await FlowerService.update(flower._id, update)
    expect(updated).toHaveProperty('_id', flower._id)
    expect(updated).toHaveProperty('name', 'Red head')
    expect(updated).toHaveProperty('price', 4)
  })

  it('should not update a non-existing flower', async () => {
    expect.assertions(1)
    const update = {
      name: 'Red head',
      price: 4,
    }

    return FlowerService.update(nonExistingFlowerId, update).catch((e) => {
      expect(e.message).toMatch(`Flower ${nonExistingFlowerId} not found`)
    })
  })

  it('should delete an existing flower', async () => {
    expect.assertions(1)
    const flower = await createFlower()
    await FlowerService.deleteFlower(flower._id)
    return FlowerService.findById(flower._id).catch((e) => {
      expect(e.message).toBe(`Flower ${flower._id} not found`)
    })
  })
})
