import { Request, Response, NextFunction } from 'express'
import { BadRequestError } from '../helpers/apiError'
import Flower from '../models/flowers'
import FlowerService from '../services/flowers'

// POST /flowers
export const createFlower = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, price, description, color, imageURL } = req.body

    const flower = new Flower({
      name,
      price,
      description,
      color,
      imageURL,
    })

    await FlowerService.create(flower)
    res.json(flower)
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// PUT /flowers/:flowerId
export const updateFlower = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const update = req.body
    const flowerId = req.params.flowerId
    const updatedFlower = await FlowerService.update(flowerId, update)
    res.json(updatedFlower)
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// DELETE /flowers/:flowerId
export const deleteFlower = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await FlowerService.deleteFlower(req.params.flowerId)
    res.status(204).end()
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// GET /flowers/:flowerId
export const findById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await FlowerService.findById(req.params.flowerId))
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// GET /flowers
export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await FlowerService.findAll())
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}