import Decimal from "decimal.js";
import { Field, ID, ObjectType } from "type-graphql";
import { DecimalScalar } from "./decimalScalar";
import { Pair } from "./pair";
import { Token } from "./token";

// graphql return object
@ObjectType()
export class PairDayData {
  @Field((type) => ID)
  id: string;

  @Field()
  date: number;

  @Field((type) => Pair)
  pair: Pair;

  @Field((type) => Token)
  token0: Token; // todo: ref

  @Field((type) => Token)
  token1: Token; // todo: ref

  @Field((type) => DecimalScalar)
  reserve0: Decimal;

  @Field((type) => DecimalScalar)
  reserve1: Decimal;

  @Field((type) => DecimalScalar)
  totalSupply: Decimal;

  @Field((type) => DecimalScalar)
  reserveUSD: Decimal;

  @Field((type) => DecimalScalar)
  dailyVolumeToken0: Decimal;

  @Field((type) => DecimalScalar)
  dailyVolumeToken1: Decimal;

  @Field((type) => DecimalScalar)
  dailyVolumeUSD: Decimal;

  @Field((type) => DecimalScalar)
  dailyTxns: Decimal;
}