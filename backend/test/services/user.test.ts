import User from '../../models/user'
import UserService from '../../services/user'
import connect, { MongodHelper } from '../db-helper'

const nonExistingUserId = '5e57b77b5744fa0b461c7906'

async function createUser() {
  const user = new User({
    name: 'Juan',
    email: 'juan@gmail.com',
    admin: false,
    password: 'juan123456',
    faworites: [],
  })
  return await UserService.create(user)
}

describe('user service', () => {
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

  it('should create a user', async () => {
    const user = await createUser()
    expect(user).toHaveProperty('_id')
    expect(user).toHaveProperty('name', 'Juan')
    expect(user).toHaveProperty('email', 'juan@gmail.com')
  })

  it('should get a user with id', async () => {
    const user = await createUser()
    const found = await UserService.findById(user._id)
    expect(found.name).toEqual(user.name)
    expect(found._id).toEqual(user._id)
  })

  // Check https://jestjs.io/docs/en/asynchronous for more info about
  // how to test async code, especially with error
  it('should not get a non-existing user', async () => {
    expect.assertions(1)
    return UserService.findById(nonExistingUserId).catch((e) => {
      expect(e.message).toMatch(`User ${nonExistingUserId} not found`)
    })
  })

  it('should update an existing user', async () => {
    const user = await createUser()
    const update = {
      name: 'Julia',
      password: 'julia09876',
    }
    const updated = await UserService.update(user._id, update)
    expect(updated).toHaveProperty('_id', user._id)
    expect(updated).toHaveProperty('name', 'Julia')
    expect(updated).toHaveProperty('password', 'julia09876')
  })

  it('should not update a non-existing user', async () => {
    expect.assertions(1)
    const update = {
      name: 'Rose',
      password: 'rosa09876',
    }

    return UserService.update(nonExistingUserId, update).catch((e) => {
      expect(e.message).toMatch(`User ${nonExistingUserId} not found`)
    })
  })

  it('should delete an existing user', async () => {
    expect.assertions(1)
    const user = await createUser()
    await UserService.deleteUser(user._id)
    return UserService.findById(user._id).catch((e) => {
      expect(e.message).toBe(`User ${user._id} not found`)
    })
  })
})