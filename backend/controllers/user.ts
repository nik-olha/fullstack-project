import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { BadRequestError, InternalServerError, NotFoundError } from '../helpers/apiError'
import { JWT_SECRET } from '../util/secret'
import User from '../models/user'
import UserService from '../services/user'

// POST /user
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, admin, password } = req.body
    const isUserExist = await UserService.findUserbyEmail(email)
    if (isUserExist)
      return res.status(400).json({ error: 'User already exist' })
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const user = new User({
      name,
      email,
      admin,
      password: hashedPassword
    })
    await UserService.create(user)
    res.json(user)
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}

// PUT /user/:userId
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const update = req.body
    const userId = req.params.userId
    const updatedFlower = await UserService.update(userId, update)
    res.json(updatedFlower)
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// DELETE /user/:userId
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await UserService.deleteUser(req.params.userId)
    res.status(204).end()
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// GET /user/:userId
export const findById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await UserService.findById(req.params.userId))
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// GET /user
export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await UserService.findAll())
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

export const addFlowers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId
    const flowerId = req.params.flowerId
    const updateUser = await UserService.addFavorites(userId, flowerId)
    res.json(updateUser)
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body
    const user = await UserService.findUserbyEmail(email)
    if (user) {
      const isCorrectPassword = await bcrypt.compare(password, user.password)
      if (!isCorrectPassword) {
        return next(new BadRequestError('Password is Incorect'))
      }
      const token = jwt.sign({ userId: user._id, email: user.email },
        JWT_SECRET, { expiresIn: '1hr' })
      res.json({ token, user })
    } else {
      next(new NotFoundError('User email does not exist'))
    }
  }
  catch (error) {
    next(new InternalServerError('Internal Server Error'))
  }
}
