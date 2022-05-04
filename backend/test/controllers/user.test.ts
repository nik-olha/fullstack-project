import request from 'supertest'
import app from '../../app'
import connect, { MongodHelper } from '../db-helper'
import { UserDocument as UserDocument } from '../../models/user'

const nonExistingUserId = '5e57b77b5744fa0b461c7906'
let existingToken = ''

async function createUser(override?: Partial<UserDocument>) {
  let user = {
    name: 'Juan',
    email: 'juan@gmail.com',
    admin: false,
    password: 'juan123456',
    faworites: [],
  }
  if (override) {
    user = { ...user, ...override }
  }
  return await request(app).post('/user/create').send(user)
}

describe('user controller', () => {
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
    const res = await createUser()
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('_id')
    expect(res.body.name).toBe('Juan')
  })

  it('should not create a user with wrong data', async () => {
    const res = await request(app)
      .post('/user/create')
      .send({
        name: 'Juan',
        admin: false,
        password: 'juan123456',
      })
    expect(res.status).toBe(400)
  })

  it('should get back an existing user', async () => {
    let res = await createUser()
    expect(res.status).toBe(200)
    const userId = res.body._id
    res = await request(app).get(`/user/${userId}`)
    expect(res.body._id).toEqual(userId)
  })

  it('should not get back a non-existing user', async () => {
    const res = await request(app).get(`/user/${nonExistingUserId}`)
    expect(res.status).toBe(404)
  })

  //   it('should be able to login with existing username', async () => {
  //     const res1 = await createUser({
  //       email: 'leo@gmail.com',
  //       name: 'Leo',
  //       password: '12344321',
  //     })
  //     const res2 = await request(app).post('/users/login').send({
  //       name: 'Leo',
  //       password: '12344321',
  //     })
  //     expect(res1.body._id).toEqual(res2.body.loginUser._id)
  //     expect(res1.body.username).toEqual(res2.body.loginUser.username)
  //     existingToken = res2.body.token
  //   })

  it('should get back all users', async () => {
    const res1 = await createUser({
      name: 'Julia',
      email: 'julia@gmail.com',
      password: 'julia123456',
    })
    const res2 = await createUser()
    console.log(res2.body)
    console.log(res1.body)

    // const res3 = await request(app).get('/user').set('Authorization', `Bearer ${existingToken}`)
    // console.log(res3.body.lenght)

    // expect(res3.body.length).toEqual(2)
    // expect(res3.body[0]._id).toEqual(res1.body._id)
    // expect(res3.body[1]._id).toEqual(res2.body._id)
  })

  it('should update an existing user', async () => {
    let res = await createUser()
    expect(res.status).toBe(200)
    const userId = res.body._id
    const update = {
      name: 'Juan2',
      password: 'juan323232',
    }

    res = await request(app).put(`/user/${userId}`).send(update)
    expect(res.status).toBe(200)

    expect(res.body.name).toEqual('Juan2')
    expect(res.body.password).toEqual('juan323232')
  })

  it('should delete an existing user', async () => {
    let res = await createUser()
    expect(res.status).toBe(200)
    const userId = res.body._id

    res = await request(app).delete(`/user/${userId}`)

    expect(res.status).toEqual(204)

    res = await request(app).get(`/user/${userId}`)
    expect(res.status).toBe(404)
  })
})
