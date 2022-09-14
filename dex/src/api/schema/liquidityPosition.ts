import Decimal from "decimal.js";
import { Field, ID, ObjectType } from "type-graphql";
import { DecimalScalar } from "./decimalScalar";
import { Pair } from "./pair";
import { User } from "./user";


@ObjectType()
export class LiquidityPosition {
  @Field((type) => ID)
  id: string;

  @Field((type) => User)
  user: User;

  @Field((type) => Pair)
  pair: Pair;

  @Field((type) => DecimalScalar)
  liquidityTokenBalance: Decimal;
}
