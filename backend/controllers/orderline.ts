import { Request, Response, NextFunction } from 'express'

import OrderLine from '../models/OrderLine'
import OrderLineService from '../services/orderline'
import { BadRequestError } from '../helpers/apiError'

// POST /orderLines
export const createOrderLine = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { quantity, price } = req.body

    const orderLine = new OrderLine({
      productId: req.params.productId,
      quantity,
      price,
    })

    await OrderLineService.createOrderLine(orderLine)
    res.json(orderLine.populate('productId'))
  } catch (error) {
    // console.log(error)
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// GET /:orderlineId
export const findOrderLineById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await OrderLineService.findById(req.params.orderLineId))
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// PUT /:orderLineId
export const updateOrderLineById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedOrderLine = await OrderLineService.updateById(
      req.params.orderLineId,
      req.body
    )
    res.json(updatedOrderLine)
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// DELETE /:orderLineId
export const deleteOrderLineById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await OrderLineService.deleteById(req.params.orderLineId)
    res.status(204).end()
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}