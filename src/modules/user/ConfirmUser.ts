import { Resolver, Mutation, Arg, UseMiddleware } from "type-graphql";

import { redis } from "../../redis";
import { User } from "../../entity/User";
import { confirmUserPrefix } from "../constants/redisPrefixes";
import { ResolveTime } from "../middleware/resolveTime";

@Resolver()
export class ConfirmUserResolver {
    @UseMiddleware(ResolveTime)
    @Mutation(() => Boolean)
    async confirmUser(@Arg("token") token: string): Promise<boolean> {
        const userId = await redis.get(confirmUserPrefix + token);

        if (!userId) {
            return false;
        }

        await User.update({ id: parseInt(userId, 10) }, { confirmed: true });
        await redis.del(token);

        return true;
    }
}
