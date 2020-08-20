import { Resolver, Mutation, UseMiddleware, Arg, ClassType, InputType, Field } from 'type-graphql'
import { User } from '../../entity/User';
// import { ResolveTime } from '../middleware/resolveTime';
import { RegisterInput } from './register/RegisterInput';
import { Middleware } from 'type-graphql/dist/interfaces/Middleware';
import { Product } from '../../entity/Product';
import { ResolveTime } from '../middleware/resolveTime';

function createResolver<T extends ClassType, X extends ClassType>(
    suffix: string,
    returnType: T,
    inputType: X,
    entity: any,
    middleware?: Middleware<any>[]
) {
    @Resolver()
    class BaseResolver {
        @Mutation(() => returnType, { name: `create${suffix}` })
        @UseMiddleware(...(middleware || []))
        async create(@Arg("data", () => inputType) data: any) {
            return entity.create(data).save();
        }
    }

    return BaseResolver;
}

@InputType()
class ProductInput {
    @Field()
    name: string;
}

const combinedMiddleware = [ResolveTime]

export const CreateUserResolver = createResolver(
    "User",
    User,
    RegisterInput,
    User,
    combinedMiddleware
);

export const CreateProductResolver = createResolver(
    "Product", 
    Product,
    ProductInput,
    Product,
    combinedMiddleware
);