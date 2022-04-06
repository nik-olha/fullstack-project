import mongoose, { Document } from 'mongoose'

export type UserDocument = Document & {
    name: string
    email: string
    admin: boolean
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        index: true,
    },
    email: {
        type: String,
        required: true,
    },
    admin: {
        type: Boolean
    }
})

export default mongoose.model<UserDocument>('User', userSchema)