import mongoose, { Document } from 'mongoose'

export type OrderLine = {
  _id: string
}

export type OrderDocument = Document & {
  userId: string
  Orderlines: OrderLine[]
  totalPrice: number
}

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalPrice: Number,
  Orderlines: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrderLine',
    },
  ],
})

export default mongoose.model<OrderDocument>('Cart', orderSchema,)
