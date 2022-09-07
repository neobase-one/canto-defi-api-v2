import { Decimal } from "@prisma/client/runtime";
import { Field, ID, ObjectType } from "type-graphql";
import { DecimalScalar } from "../schema/decimalScalar";
import { AccountCToken } from "./accountCToken";

@ObjectType()
export class Account {
  @Field((type) => ID)
  id: string;

  @Field((type) => [AccountCToken], { nullable: true })
  tokens: [AccountCToken]

  @Field((type) => DecimalScalar, { nullable: true })
  countLiquidated: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  liquidityTokenBalance: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  countLiquidator: Decimal

  @Field((type) => Boolean, { nullable: true })
  hasBorrowed: Boolean
}
