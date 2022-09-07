import { Field, InputType, Int } from "type-graphql";
import "reflect-metadata"

export enum OrderDirection {
  ASC = "ASC",
  DES = "DES"
}

@InputType()
export class MarketsInput {
  @Field((type) => [String], { nullable: true })
  id: [string];

  @Field((type => Int), { defaultValue: 1000, nullable: true })
  first: number;

  @Field((type => Int), { defaultValue: 0, nullable: true })
  skip: number

  @Field({ defaultValue: "totalCash", nullable: true })
  orderBy: string

  @Field({ defaultValue: OrderDirection.ASC, nullable: true })
  orderDirection: OrderDirection

  constructor() {
    this.id = [""],
    this.first = 0,
    this.skip = 0,
    this.orderBy = "",
    this.orderDirection = OrderDirection.ASC
  }
}

@InputType()
export class MarketInput {
  // @Field({ defaultValue: "", nullable: false })
  @Field()
  id: string
}
