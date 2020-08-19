import { Resolver, Mutation, Arg, UseMiddleware } from 'type-graphql'
import { User } from '../../entity/User'
import { ResolveTime } from '../middleware/resolveTime'
import { redis } from '../../redis'
import { confirmationPrefix } from '../constants/redisPrefixes'

@Resolver()
export class ConfirmUserResolver {
    @UseMiddleware(ResolveTime)
    @Mutation(() => Boolean, { nullable: true })
    async confirmUser(
        @Arg('token') token: string
    ): Promise<boolean> {
        const userId = await redis.get(confirmationPrefix + token)
        if (!userId) return false

        await User.update({ id: parseInt(userId, 10)}, { confirmed: true })
        await redis.del(confirmationPrefix + token)

        return true
    }

}
