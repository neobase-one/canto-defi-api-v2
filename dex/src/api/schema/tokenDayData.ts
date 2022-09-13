import Decimal from "decimal.js";
import { Field, ID, ObjectType } from "type-graphql";
import { DecimalScalar } from "./decimalScalar";
import { Token } from "./token";

@ObjectType()
export class TokenDayData {
  @Field((type) => ID)
  id: string;

  @Field()
  date: number;

  @Field((type) => Token)
  token: Token; // todo: Ref

  @Field((type) => DecimalScalar)
  dailyVolumeToken: Decimal;

  @Field((type) => DecimalScalar)
  dailyVolumeNOTE: Decimal;

  @Field((type) => DecimalScalar)
  dailyVolumeUSD: Decimal;

  @Field((type) => DecimalScalar)
  dailyTxns: Decimal;

  @Field((type) => DecimalScalar)
  totalLiquidityToken: Decimal;

  @Field((type) => DecimalScalar)
  totalLiquidityNOTE: Decimal;

  @Field((type) => DecimalScalar)
  totalLiquidityUSD: Decimal;

  @Field((type) => DecimalScalar)
  priceUSD: Decimal;
}
