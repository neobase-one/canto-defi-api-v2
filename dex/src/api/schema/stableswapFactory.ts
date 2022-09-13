import Decimal from "decimal.js";
import { Field, ID, Int, ObjectType } from "type-graphql";
import { DecimalScalar } from "./decimalScalar";

// graphql return object
@ObjectType()
export class StableswapFactory {
  @Field((type) => ID, { name: "id", nullable: true })
  address: string;

  @Field((type) => Int, { nullable: true })
  pairCount: number;

  @Field((type) => DecimalScalar, { nullable: true })
  totalVolumeUSD: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  totalVolumeNOTE: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  untrackedVolumeUSD: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  totalLiquidityUSD: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  totalLiquidityNOTE: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  txCount: Decimal;

  block: Decimal;
}