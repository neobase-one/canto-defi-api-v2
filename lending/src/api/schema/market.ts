import { Decimal } from "@prisma/client/runtime";
import { Field, ID, ObjectType } from "type-graphql";
import { DecimalScalar } from "../schema/decimalScalar";

@ObjectType()
export class Market {
  @Field((type) => ID, { nullable: true })
  id: string;

  @Field((type) => String, { nullable: true })
  name: string;

  @Field((type) => String, { nullable: true })
  symbol: string;

  @Field((type) => DecimalScalar, { nullable: true })
  accrualBlockNumber: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  totalSupply: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  exchangeRate: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  totalReserves: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  totalCash: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  totalDeposits: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  totalBorrows: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  perBlockBorrowInterest: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  perBlockSupplyInterest: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  borrowIndex: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  tokenPerNoteRatio: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  tokenPerUSDRatio: Decimal;
}
