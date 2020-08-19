import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Generated } from "typeorm";
import { ObjectType, Field, ID, Root } from "type-graphql";

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field(() => ID)
    // @PrimaryGeneratedColumn('uuid')
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    @Generated("uuid")
    uuid: string;

    @Field()
    @Column()
    firstName: string;

    @Field()
    @Column()
    lastName: string;

    @Field()
    @Column('text', { unique: true })
    email: string;

    @Field()
    name(@Root() parent: User): string {
        return `${parent.firstName} ${parent.lastName}`;
    }

    @Column()
    password: string;

    @Column("bool", { default: false })
    confirmed: boolean;
}