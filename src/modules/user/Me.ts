import { Resolver, Query, Ctx, UseMiddleware } from "type-graphql";

import { User } from "../../entity/User";
import { MyContext } from "../../typings";
import { ResolveTime } from "../middleware/resolveTime";

@Resolver()
export class MeResolver {
    @UseMiddleware(ResolveTime)
    @Query(() => User, { nullable: true })
    async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
        if (!ctx.req.session!.userId) {
            return undefined;
        }

        return User.findOne(ctx.req.session!.userId);
    }
}
