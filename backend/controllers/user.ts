import { Request, Response, NextFunction } from 'express'
import { BadRequestError } from '../helpers/apiError'
import User from '../models/user'
import UserService from '../services/user'

// POST /user
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, admin } = req.body

    const user = new User({
      name,
      email,
      admin
    })

    await UserService.create(user)
    res.json(user)
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
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