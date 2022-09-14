import Decimal from "decimal.js";
import { Field, ID, ObjectType } from "type-graphql";
import { DecimalScalar } from "./decimalScalar";
import BigInt from 'graphql-bigint';

@ObjectType()
export class StableswapDayData {
  @Field((type) => ID)
  id: string;

  @Field({ nullable: true })
  date: number;

  @Field((type) => DecimalScalar, { nullable: true })
  dailyVolumeNOTE: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  dailyVolumeUSD: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  dailyVolumeUntracked: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  totalVolumeNOTE: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  totalLiquidityNOTE: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  totalVolumeUSD: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  totalLiquidityUSD: Decimal;

  @Field((type) => BigInt, { nullable: true })
  txCount: BigInt;
}
