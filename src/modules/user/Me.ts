import { Resolver, Query, Ctx, UseMiddleware } from 'type-graphql'
import { User } from '../../entity/User'
import { loginContext } from '../../typings'
import { ResolveTime } from '../middleware/resolveTime'

@Resolver()
export class MeResolver {
    @UseMiddleware(ResolveTime)
    @Query(() => User, { nullable: true })
    async me(@Ctx() ctx: loginContext): Promise<User | undefined> {
        const userId = ctx.req.session!.userId
        if (!userId) return undefined
        return User.findOne(userId)
    }
}
