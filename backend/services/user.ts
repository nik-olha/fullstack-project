import { NotFoundError } from "../helpers/apiError"
import User, { UserDocument } from "../models/user"

const create = async (user: UserDocument): Promise<UserDocument> => {
    return user.save()
}

async function findUserbyEmail(email?: string): Promise<UserDocument | null> {
    const user = await User.findOne({ email })
    return user
}

const findById = async (userId: string): Promise<UserDocument> => {
    const foundUser = await User.findById(userId)
    if (!foundUser) {
        throw new NotFoundError(`User ${userId} not found`)
    }
    return foundUser
}

const findAll = async (): Promise<UserDocument[]> => {
    return User.find().populate('faworites').select('-password');
}

const update = async (
    userId: string,
    update: Partial<UserDocument>
): Promise<UserDocument | null> => {
    const foundUser = await User.findByIdAndUpdate(userId, update, {
        new: true,
    })
    if (!foundUser) {
        throw new NotFoundError(`User ${userId} not found`)
    }
    return foundUser
}


const deleteUser = async (userId: string): Promise<UserDocument | null> => {
    const foundUser = User.findByIdAndDelete(userId)
    if (!foundUser) {
        throw new NotFoundError(`User ${userId} not found`)
    }
    return foundUser
}

const addFavorites = async (userId: string, flowerId: string): Promise<UserDocument | null> => {
    const user = await User.findById(userId)
    user?.favorites.push(flowerId)
    if (!user) {
        throw new NotFoundError(`User ${userId} not found`)
    }
    return user.save()
}

export default {
    create,
    findUserbyEmail,
    findById,
    findAll,
    update,
    deleteUser,
    addFavorites,
}
