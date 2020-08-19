import { Field, InputType } from "type-graphql";
import { PasswordInput } from "../../../modules/shared/PasswordInput";

@InputType()
export class ChangePasswordInput extends PasswordInput {
    @Field()
    token: string
}