import { Decimal } from "@prisma/client/runtime";
import { Field, ID, ObjectType } from "type-graphql";
import { DecimalScalar } from "../schema/decimalScalar";

@ObjectType()
export class Comptroller {
  @Field((type) => ID)
  id: string;

  @Field((type) => String, {nullable: true})
  priceOracle: string;

  @Field((type) => DecimalScalar, {nullable: true})
  closeFactor: Decimal;

  @Field((type) => DecimalScalar, {nullable: true})
  liquidationIncentive: Decimal;

  @Field((type) => DecimalScalar, {nullable: true})
  maxAssets: Decimal;
}
