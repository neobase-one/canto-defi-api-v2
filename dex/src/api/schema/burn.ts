import Decimal from "decimal.js";
import { Field, ID, ObjectType } from "type-graphql";
import { DecimalScalar } from "./decimalScalar";
import { Pair} from "./pair";
import { Transaction } from "./transaction";
import BigInt from 'graphql-bigint';

@ObjectType()
export class Burn {
  @Field((type) => ID)
  id: string;

  @Field((type) => Transaction)
  transaction: string; // todo: Ref

  @Field((type) => BigInt)
  timestamp: BigInt;

  @Field((type) => Pair)
  pair: Pair; // todo: Ref

  @Field((type) => DecimalScalar)
  liquidity: Decimal;

  @Field((type) => DecimalScalar)
  amount0: Decimal;

  @Field((type) => DecimalScalar)
  amount1: Decimal;

  @Field((type) => BigInt)
  logIndex: BigInt;

  @Field((type) => DecimalScalar)
  amountUSD: Decimal;

  @Field((type) => DecimalScalar)
  feeLiquidity: Decimal;

  @Field((type) => Boolean)
  needsComplete: Boolean;

  // todo: to, sender, feeTo - Bytes
  @Field((type) => String)
  to: string;

  @Field((type) => String)
  sender: string;

  @Field((type) => String)
  feeTo: string;
}