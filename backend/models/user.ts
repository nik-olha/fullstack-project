import mongoose, { Document } from 'mongoose'

export type UserDocument = Document & {
    name: string
    email: string
    admin: boolean
    password: string
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
    password: {type: String},
    flowers: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Flower'
    }]
})

export default mongoose.model<UserDocument>('User', userSchema)