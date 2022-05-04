import mongoose, { Document } from 'mongoose'

export type FlowerDocument = Document & {
    name: string
    price: number
    color: string
    description: string
    instock: number
    imageURL: string
}

const flowerSchema = new mongoose.Schema({
    name: {
        type: String,
        index: true,
        required: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true,
        min: 1,
    },
    description: {
        type: String,
    },
    color: {
        type: String,
    },
    instock: {
        type: Number,
        required: true,
    },
    imageURL: { String }
})

export default mongoose.model<FlowerDocument>('Flower', flowerSchema)
