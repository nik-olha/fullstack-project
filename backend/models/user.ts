import mongoose, { Document } from 'mongoose'

export type UserDocument = Document & {
    name: string
    email: string
    admin: boolean
    password: string
    favorites: string[] 
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        index: true,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    admin: {
        type: Boolean
    }, 
    password: {type: String, required: true},
    favorites: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Flower'
    }]
})

export default mongoose.model<UserDocument>('User', userSchema)