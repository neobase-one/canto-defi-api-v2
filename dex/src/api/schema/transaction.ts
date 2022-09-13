import Decimal from "decimal.js";
import { Field, ID, ObjectType } from "type-graphql";
import { Burn } from "./burn";
import { DecimalScalar } from "./decimalScalar";
import { Mint } from "./mint";
import { Swap } from "./swap";

const BigInt = require('graphql-bigint')

@ObjectType()
export class Transaction {
  @Field((type) => ID)
  id: string;

  @Field((type) => BigInt)
  timestamp: BigInt;

  @Field((type) => BigInt)
  blockNumber: BigInt;

  @Field((type) => [Mint])
  mints: Mint[];

  @Field((type) => [Burn])
  burns: Burn[];

  @Field((type) => [Swap])
  swaps: Swap[];
}