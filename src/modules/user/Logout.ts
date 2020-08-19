import { Resolver, Mutation, Ctx, UseMiddleware } from "type-graphql";
import { loginContext } from "../../typings";
import { logger } from "../../utils/logManager";
import { ResolveTime } from "../middleware/resolveTime";

@Resolver()
export class LogoutResolver {
    @UseMiddleware(ResolveTime)
    @Mutation(() => Boolean)
    async logout(
        @Ctx() ctx: loginContext
    ): Promise<Boolean> { 
        return new Promise((resolve, reject) => 
            ctx.req.session!.destroy((err) => {
                if (err)  { 
                    logger.error(err) 
                    return reject(err)
                }
                ctx.res.clearCookie('qid')
                return resolve(true)
            })
        )
    }
}