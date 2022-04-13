import mongoose, { Document } from 'mongoose'

export type UserDocument = Document & {
    name: string
    email: string
    admin: boolean
    flowers: string[] 
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    admin: {
        type: Boolean
    },
    flowers: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Flower'
    }]
})

export default mongoose.model<UserDocument>('User', userSchema)