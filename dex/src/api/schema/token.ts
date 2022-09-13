import Decimal from "decimal.js";
import { Field, ID, Int, ObjectType } from "type-graphql";
import { DecimalScalar } from "./decimalScalar";
import BigInt from 'graphql-bigint';

@ObjectType()
export class Token {
  @Field((type) => ID)
  id: string;

  @Field((type) => String, { nullable: true })
  name: string;

  @Field((type) => String, { nullable: true })
  symbol: string;

  @Field((type) => BigInt, { nullable: true })
  decimals: BigInt;

  @Field((type) => BigInt, { nullable: true })
  totalSupply: BigInt;

  @Field((type) => DecimalScalar, { nullable: true })
  tradeVolume: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  tradeVolumeUSD: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  untrackedVolumeUSD: Decimal;

  @Field((type) => BigInt, { nullable: true })
  txCount: BigInt;

  @Field((type) => DecimalScalar, { nullable: true })
  totalLiquidity: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  derivedNOTE: Decimal;
}
