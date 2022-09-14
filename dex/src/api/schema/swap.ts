import Decimal from "decimal.js";
import { Field, ID, ObjectType } from "type-graphql";
import { DecimalScalar } from "./decimalScalar";
import { Pair } from "./pair";
import { Transaction } from "./transaction";
import BigInt from 'graphql-bigint';

@ObjectType()
export class Swap {
  @Field((type) => ID)
  id: string;

  @Field((type) => Transaction)
  transaction: Transaction;

  @Field((type) => BigInt)
  timestamp: BigInt;

  @Field((type) => Pair)
  pair: Pair;

  @Field((type) => DecimalScalar)
  liquidity: Decimal;

  @Field((type) => DecimalScalar)
  amount0In: Decimal;

  @Field((type) => DecimalScalar)
  amount1In: Decimal;

  @Field((type) => DecimalScalar)
  amount0Out: Decimal;

  @Field((type) => DecimalScalar)
  amount1Out: Decimal;

  @Field((type) => DecimalScalar)
  logIndex: Decimal;

  @Field((type) => DecimalScalar)
  amountUSD: Decimal;

  @Field((type) => String)
  to: string;

  @Field((type) => String)
  sender: string;

  @Field((type) => String)
  from: string;
}