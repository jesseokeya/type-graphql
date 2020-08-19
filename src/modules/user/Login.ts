import { Resolver, Mutation, Arg, Ctx, UseMiddleware } from 'type-graphql'
import bcrypt from 'bcrypt'
import { User } from '../../entity/User'
import { loginContext } from '../../typings'
import { ResolveTime } from '../middleware/resolveTime'

@Resolver()
export class LoginResolver {
    @UseMiddleware(ResolveTime)
    @Mutation(() => User, { nullable: true })
    async login(
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Ctx() ctx: loginContext
    ): Promise<User | null> {
        const user = await User.findOne({ where: { email } })
        if (!user) return null

        const valid = await bcrypt.compare(password, user.password)

        if (!valid) return null

        ctx.req.session!.userId = user.id 

        return user
    }

}
