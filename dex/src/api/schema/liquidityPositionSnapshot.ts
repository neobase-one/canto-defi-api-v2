import Decimal from "decimal.js";
import { Field, ID, ObjectType } from "type-graphql";
import { DecimalScalar } from "./decimalScalar";
import { LiquidityPosition } from "./liquidityPosition";
import { Pair } from "./pair";
import { User } from "./user";

@ObjectType()
export class LiquidityPositionSnapshot {
  @Field((type) => ID)
  id: string;

  @Field((type) => LiquidityPosition)
  liquidityPosition: LiquidityPosition; // todo ref

  @Field((type) => DecimalScalar)
  timestamp: Decimal;

  @Field((type) => DecimalScalar)
  blockNumber: Decimal;

  @Field((type) => User)
  user: User; // todo ref

  @Field((type) => Pair)
  pair: Pair; // todo ref

  @Field((type) => DecimalScalar)
  token0PriceUSD: Decimal;

  @Field((type) => DecimalScalar)
  token1PriceUSD: Decimal;

  @Field((type) => DecimalScalar)
  reserve0: Decimal;

  @Field((type) => DecimalScalar)
  reserve1: Decimal;

  @Field((type) => DecimalScalar)
  reserveUSD: Decimal;

  @Field((type) => DecimalScalar)
  liquidityTokenTotalSupply: Decimal;

  @Field((type) => DecimalScalar)
  liquidityTokenBalance: Decimal;

}