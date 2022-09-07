import { Decimal } from "@prisma/client/runtime";
import { Field, ID, ObjectType } from "type-graphql";
import { Account } from "./account";
import { Market } from "./market";
import { DecimalScalar } from "../schema/decimalScalar";

@ObjectType()
export class AccountCToken {
  @Field((type) => ID)
  id: string;

  @Field((type) => Market, { nullable: true })
  market: Market;

  @Field((type) => String, { nullable: true })
  symbol: string;

  @Field((type) => Account, { nullable: true })
  account: Account;

  @Field((type) => [String], { nullable: true })
  transactionHashes: [string];

  @Field((type) => [DecimalScalar], { nullable: true })
  transactionTimes: [Decimal];

  @Field((type) => DecimalScalar, { nullable: true })
  accrualBlockNumber: Decimal;

  @Field((type) => Boolean, { nullable: true })
  enteredMarket: Boolean;

  @Field((type) => DecimalScalar, { nullable: true })
  cTokenBalance: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  totalUnderlyingSupplied: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  totalUnderlyingRedeemed: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  accountBorrowIndex: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  totalUnderlyingBorrowed: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  totalUnderlyingRepaid: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  storedBorrowBalance: Decimal;
}
