import { MiddlewareFn } from "type-graphql";
import { loginContext } from "src/typings";

export const isAuth: MiddlewareFn<loginContext> = async ({ context }, next) => {
    if (!context.req.session!.userId) throw new Error('not authenticated')
    return next();
};