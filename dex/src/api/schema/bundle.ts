import Decimal from "decimal.js";
import { Field, ID, ObjectType } from "type-graphql";
import { DecimalScalar } from "./decimalScalar";

@ObjectType()
export class Bundle {
  @Field((type) => ID)
  id: string;

  @Field((type) => DecimalScalar)
  notePrice: Decimal;
}
