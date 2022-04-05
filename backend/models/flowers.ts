import mongoose, { Document } from 'mongoose'

export type FlowerDocument = Document & {
    name: string
    price: number
    color: string
    description: string
    imageURL: string
}

const flowerSchema = new mongoose.Schema({
    name: {
        type: String,
        index: true,
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
    imageURL: { String }
})

export default mongoose.model<FlowerDocument>('Flower', flowerSchema)