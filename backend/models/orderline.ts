import mongoose, { Document } from 'mongoose'

export type OrderLineDocument = Document & {
  productId: string
  quantity: number
  price: number
}

const orderLineSchema = new mongoose.Schema({
  quantity: { type: Number, default: 1 },
  price: Number,
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flower',
    required: true,
  },
})

export default mongoose.model<OrderLineDocument>(
  'OrderLine',
  orderLineSchema
)
