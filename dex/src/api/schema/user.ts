import Decimal from "decimal.js";
import { Field, ID, ObjectType } from "type-graphql";
import { DecimalScalar } from "./decimalScalar";
import { LiquidityPosition } from "./liquidityPosition";


@ObjectType()
export class User {
  @Field((type) => ID)
  id: string;

  @Field((type) => LiquidityPosition)
  liquidityPosition: LiquidityPosition;

  @Field((type) => DecimalScalar)
  usdSwapped: Decimal;
}
