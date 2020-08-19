import { Resolver, Mutation, Arg, UseMiddleware, Ctx } from 'type-graphql'
import { User } from '../../entity/User'
import { ResolveTime } from '../middleware/resolveTime'
import { redis } from '../../redis'
import bcrypt from 'bcrypt'
import { forgotPasswordPrefix } from '../constants/redisPrefixes';
import { ChangePasswordInput } from './changePassword/ChangePasswordInput';
import { loginContext } from 'src/typings'

@Resolver()
export class ChangePasswordResolver {
    @UseMiddleware(ResolveTime)
    @Mutation(() => User, { nullable: true })
    async changePassword(
        @Arg('data') {
            token, password
        }: ChangePasswordInput, 
        @Ctx() ctx: loginContext
    ): Promise<User | null> {
        const userId = await redis.get(forgotPasswordPrefix + token)
        if (!userId) return null
        const user = await User.findOne(userId)
        if (!user) return null
        await redis.del(forgotPasswordPrefix + token)
        user.password = await bcrypt.hash(password, 12)
        await user.save()
        ctx.req.session!.userId = user.id
        return user
        
    }

}
