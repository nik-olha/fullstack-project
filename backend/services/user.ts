import { NotFoundError } from "../helpers/apiError"
import user from "../models/user"
import User, { UserDocument } from "../models/user"

const create = async (user: UserDocument): Promise<UserDocument> => {
    return user.save()
}

const findById = async (userId: string): Promise<UserDocument> => {
    const foundUser = await User.findById(userId)

    if (!foundUser) {
        throw new NotFoundError(`User ${userId} not found`)
    }

    return foundUser
}

const findAll = async (): Promise<UserDocument[]> => {
    return User.find().populate('flowers');
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

const addFlowers = async (userId: string, flowerId: string): Promise<UserDocument | null> => {
    const user = await User.findById(userId)
    user?.flowers.push(flowerId)

    if (!user) {
        throw new NotFoundError(`User ${userId} not found`)
    }

    return user.save()
}


export default {
    create,
    findById,
    findAll,
    update,
    deleteUser,
    addFlowers,
}
