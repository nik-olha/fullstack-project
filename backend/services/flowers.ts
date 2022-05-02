import { NotFoundError } from "../helpers/apiError"
import Flower, { FlowerDocument } from "../models/flowers"

const create = async (flower: FlowerDocument): Promise<FlowerDocument> => {
    return flower.save()
  }

  const findById = async (flowerId: string): Promise<FlowerDocument> => {
    const foundFlower = await Flower.findById(flowerId)
  
    if (!foundFlower) {
      throw new NotFoundError(`Flower ${flowerId} not found`)
    }
  
    return foundFlower
  }
  
  const findAll = async (): Promise<FlowerDocument[]> => {
    return Flower.find().sort({ name: 1 })
  }

  const update = async (
    flowerId: string,
    update: Partial<FlowerDocument>
  ): Promise<FlowerDocument | null> => {
    const foundFlower = await Flower.findByIdAndUpdate(flowerId, update, {
      new: true,
    })
    const flowers = await findAll()
  
    if (!foundFlower) {
      throw new NotFoundError(`Flower ${flowerId} not found`)
    }
  
    return foundFlower
  }


  const deleteFlower = async (flowerId: string): Promise<FlowerDocument | null> => {
    const foundFlower = Flower.findByIdAndDelete(flowerId)
  
    if (!foundFlower) {
      throw new NotFoundError(`Flower ${flowerId} not found`)
    }
  
    return foundFlower
  }

  export default {
    create,
    findById,
    findAll,
    update,
    deleteFlower,
  }
  