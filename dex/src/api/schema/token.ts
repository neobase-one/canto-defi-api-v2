import Decimal from "decimal.js";
import { Field, ID, Int, ObjectType } from "type-graphql";
import { DecimalScalar } from "./decimalScalar";

@ObjectType()
export class Token {
  @Field((type) => ID)
  id: string;

  @Field((type) => String, { nullable: true })
  name: string;

  @Field((type) => String, { nullable: true })
  symbol: string;

  @Field((type) => Int, { nullable: true })
  decimals: number;

  @Field((type) => DecimalScalar, { nullable: true })
  totalSupply: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  tradeVolume: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  tradeVolumeUSD: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  untrackedVolumeUSD: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  txCount: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  totalLiquidity: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  derivedNOTE: Decimal;
}
