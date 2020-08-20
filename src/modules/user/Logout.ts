import { Resolver, Mutation, Ctx, UseMiddleware } from "type-graphql";
import { MyContext } from "../../typings";
import { ResolveTime } from "../middleware/resolveTime";

@Resolver()
export class LogoutResolver {
    @UseMiddleware(ResolveTime)
    @Mutation(() => Boolean)
    async logout(@Ctx() ctx: MyContext): Promise<Boolean> {
        return new Promise((res, rej) =>
            ctx.req.session!.destroy(err => {
                if (err) {
                    console.log(err);
                    return rej(false);
                }

                ctx.res.clearCookie("qid");
                return res(true);
            })
        );
    }
}
