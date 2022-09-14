import Decimal from "decimal.js";
import { Field, ID, ObjectType } from "type-graphql";
import { DecimalScalar } from "./decimalScalar";
import { Pair } from "./pair";
import BigInt from 'graphql-bigint';

// graphql return object
@ObjectType()
export class PairHourData {
  @Field((type) => ID)
  id: string;

  @Field((type) => DecimalScalar)
  hourStartUnix: Decimal;

  @Field((type) => Pair)
  pair: Pair; // todo

  @Field((type) => DecimalScalar)
  reserve0: Decimal;

  @Field((type) => DecimalScalar)
  reserve1: Decimal;

  @Field((type) => DecimalScalar)
  totalSupply: Decimal;

  @Field((type) => DecimalScalar)
  reserveUSD: Decimal;

  @Field((type) => DecimalScalar)
  hourlyVolumeToken0: Decimal;

  @Field((type) => DecimalScalar)
  hourlyVolumeToken1: Decimal;

  @Field((type) => DecimalScalar)
  hourlyVolumeUSD: Decimal;

  @Field((type) => BigInt)
  hourlyTxns: BigInt;

}