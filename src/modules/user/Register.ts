import { Resolver, Query, Mutation, Arg, UseMiddleware } from 'type-graphql'
import bcrypt from 'bcrypt'
import { User } from '../../entity/User'
import { RegisterInput } from './register/RegisterInput'
import { isAuth } from '../middleware/isAuth'
import { ResolveTime } from '../middleware/resolveTime'

@Resolver()
export class RegisterResolver {
    @UseMiddleware(isAuth, ResolveTime)
    @Query(() => String)
    async hello() {
        return 'Hello World!'
    }

    @UseMiddleware(ResolveTime)
    @Mutation(() => User)
    async register(
        @Arg('context') {
            email,
            firstName,
            lastName,
            password
        }: RegisterInput
    ) : Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 12)

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        }).save()

        return user
    }

}
