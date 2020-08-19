import { Resolver, Query, Ctx } from 'type-graphql'
import { User } from '../../entity/User'
import { loginContext } from '../../typings'

@Resolver()
export class MeResolver {
    @Query(() => User, { nullable: true })
    async me(@Ctx() ctx: loginContext): Promise<User | undefined> {
        const userId = ctx.req.session!.userId
        if (!userId) return undefined
        return User.findOne(userId)
    }
}
