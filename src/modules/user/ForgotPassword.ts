import { Resolver, Mutation, Arg, UseMiddleware } from 'type-graphql'
import { User } from '../../entity/User'
import { ResolveTime } from '../middleware/resolveTime'
import { redis } from '../../redis'
import { v4 } from "uuid";
import { sendEmail } from '../utils/sendEmail';
import { forgotPasswordPrefix } from '../constants/redisPrefixes';

@Resolver()
export class ForgotPasswordResolver {
    @UseMiddleware(ResolveTime)
    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg('email') email: string
    ): Promise<boolean> {
        const user = await User.findOne({ where: { email } })
        if (!user) return true
        const token = v4()
        await redis.set(forgotPasswordPrefix + token, user.id, 'ex', 60 * 60 * 24) // 1 day expiration
        await sendEmail(email, `http://localhost:3000/user/change-password/${token}`)

        return true
    }

}
