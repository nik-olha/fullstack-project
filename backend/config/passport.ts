import { JWT_SECRET } from "../util/secret";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import UserService from "../services/user"

export const jwtStrategy = new JwtStrategy({
    secretOrKey: JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}, async (payload: any, done: any) => {
    const userEmail = payload.email
    const foundUser = await UserService.findUserbyEmail(userEmail)
    done(null, foundUser)
})
