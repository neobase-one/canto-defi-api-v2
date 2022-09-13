import Decimal from "decimal.js";
import { Field, ID, ObjectType } from "type-graphql";
import { DecimalScalar } from "./decimalScalar";
import { Token } from "./token";

@ObjectType()
export class Pair {
  @Field((type) => ID)
  id: string;

  @Field((type) => Token)
  token0: Token;

  @Field((type) => Token)
  token1: Token;

  @Field((type) => DecimalScalar)
  reserve0: Decimal;

  @Field((type) => DecimalScalar)
  reserve1: Decimal;

  @Field((type) => DecimalScalar)
  totalSupply: Decimal;

  @Field((type) => DecimalScalar)
  reserveNOTE: Decimal;

  @Field((type) => DecimalScalar)
  reserveUSD: Decimal;

  @Field((type) => DecimalScalar)
  trackedReserveNOTE: Decimal;

  @Field((type) => DecimalScalar)
  token0Price: Decimal;

  @Field((type) => DecimalScalar)
  token1Price: Decimal;

  @Field((type) => DecimalScalar)
  volumeToken0: Decimal;

  @Field((type) => DecimalScalar)
  volumeToken1: Decimal;

  @Field((type) => DecimalScalar)
  volumeUSD: Decimal;

  @Field((type) => DecimalScalar)
  untrackedVolumeUSD: Decimal;

  @Field((type) => DecimalScalar)
  txCount: Decimal;

  @Field((type) => DecimalScalar)
  createdAtTimestamp: Decimal;

  @Field((type) => DecimalScalar)
  createdAtBlockNumber: Decimal;

  @Field((type) => DecimalScalar)
  liquidityProviderCount: Decimal;

    // async getToken(id: string): Promise<Token> {
    // const token = await TokenModel.find({ id: id });
    // return token[0].toGenerated();
  // }
}
