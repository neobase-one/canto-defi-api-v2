import { Field, InputType, Int } from "type-graphql";

export enum OrderDirection {
  ASC = "ASC",
  DES = "DES"
}

@InputType()
export class StableswapFactoryInput {
  @Field({ nullable: false })
  id: string

  @Field({ nullable: true })
  blockNumber: number
}

@InputType()
export class TokenDayDatasInput {
  @Field({ nullable: true })
  tokenAddress: string

  @Field((type => Int), { defaultValue: 1000, nullable: true })
  first: number

  @Field((type => Int), { defaultValue: 0, nullable: true })
  skip: number

  @Field({ defaultValue: "date", nullable: true })
  orderBy: string

  @Field({ defaultValue: OrderDirection.ASC, nullable: true })
  orderDirection: OrderDirection

  @Field((type => Int), { nullable: true })
  date: number
}

@InputType()
export class StableswapFactoriesInput {
  @Field({ nullable: false })
  id: string

  @Field({ nullable: true })
  block: number
}

@InputType()
export class StableswapDayDatasInput {
  @Field((type) => Int, { nullable: false })
  startTime: number

  @Field((type) => Int, { defaultValue: 0, nullable: true })
  skip: number

  @Field((type) => Int, { defaultValue: 5, nullable: true })
  first: number

  @Field({ defaultValue: "date", nullable: true })
  orderBy: string

  @Field({ defaultValue: OrderDirection.ASC, nullable: true })
  orderDirection: OrderDirection
}

@InputType()
export class HealthInput {
  @Field({ nullable: false })
  subgraphName: string
}

@InputType()
export class TokenInput {
  @Field((type) => [String], { nullable: true })
  id_in: [string]

  @Field((type => Int), { nullable: true })
  block: number

  @Field((type => Int), { defaultValue: 500, nullable: true })
  first: number

  @Field((type => Int), { defaultValue: 0, nullable: true })
  skip: number
}

@InputType()
export class PairInput {
  @Field({ nullable: true })
  id: string

  @Field((type) => [String], { nullable: true })
  id_in: [string]

  @Field((type => Int), { defaultValue: 1000, nullable: true })
  first: number

  @Field({ defaultValue: "date", nullable: true })
  orderBy: string

  @Field({ defaultValue: OrderDirection.ASC, nullable: true })
  orderDirection: OrderDirection

  @Field((type => Int), { defaultValue: 0, nullable: true })
  skip: number

  @Field((type => Int), { nullable: true })
  block: number
}

@InputType()
export class UserInput {
  @Field({ nullable: false })
  id: string
}

@InputType()
export class UsersInput {
  @Field({ nullable: false })
  id: string

  @Field({ nullable: true })
  block: string
}

@InputType()
export class LiquidityPositionInput {
  @Field({ nullable: false })
  id: string
}

@InputType()
export class LiquidityPositionsInput {
  @Field({ nullable: false })
  user: string
}

@InputType()
export class LiquidityPositionSnapshotInput {
  @Field({ nullable: false })
  id: string
}

@InputType()
export class LiquidityPositionSnapshotsInput {
  @Field({ nullable: false })
  user: string

  @Field((type => Int), { defaultValue: 1000, nullable: true })
  first: number

  @Field((type => Int), { defaultValue: 0, nullable: true })
  skip: number
}

@InputType()
export class TransactionInput {
  @Field({ nullable: false })
  id: string
}

@InputType()
export class TransactionsInput {
  @Field((type) => [String], { nullable: true })
  id: [string]

  @Field((type => Int), { defaultValue: 100, nullable: true })
  first: number

  @Field({ defaultValue: "timestamp", nullable: true })
  orderBy: string

  @Field({ defaultValue: OrderDirection.ASC, nullable: true })
  orderDirection: OrderDirection
}

@InputType()
export class MintInput {
  @Field({ nullable: false })
  id: string
}

@InputType()
export class MintsInput {
  @Field((type) => [String], { nullable: true })
  pair_in: [string]

  @Field((type) => String, { nullable: true })
  pair: string

  @Field((type) => String, { nullable: true })
  to: string

  @Field((type) => Int, { defaultValue: 200, nullable: true })
  first: number

  @Field({ defaultValue: "timestamp", nullable: true })
  orderBy: string

  @Field({ defaultValue: OrderDirection.ASC, nullable: true })
  orderDirection: OrderDirection
}

@InputType()
export class BurnInput {
  @Field({ nullable: false })
  id: string
}

@InputType()
export class BurnsInput {
  @Field((type) => [String], { nullable: true })
  pair_in: [string]

  @Field((type) => String, { nullable: true })
  pair: string

  @Field((type) => String, { nullable: true })
  to: string

  @Field((type) => Int, { defaultValue: 200, nullable: true })
  first: number

  @Field({ defaultValue: "timestamp", nullable: true })
  orderBy: string

  @Field({ defaultValue: OrderDirection.ASC, nullable: true })
  orderDirection: OrderDirection
}

@InputType()
export class SwapInput {
  @Field({ nullable: false })
  id: string
}

@InputType()
export class SwapsInput {
  @Field((type) => [String], { nullable: true })
  pair_in: [string]

  @Field((type) => String, { nullable: true })
  pair: string

  @Field((type) => Int, { defaultValue: 200, nullable: true })
  first: number

  @Field({ defaultValue: "timestamp", nullable: true })
  orderBy: string

  @Field({ defaultValue: OrderDirection.ASC, nullable: true })
  orderDirection: OrderDirection
}

@InputType()
export class BundleInput {
  @Field({ nullable: false })
  id: string
}

@InputType()
export class BundlesInput {
  @Field((type) => Int, { nullable: false })
  id: string

  @Field({ nullable: true })
  blockNumber: number
}

@InputType()
export class StableswapDayDataInput {
  @Field({ nullable: false })
  id: string
}

@InputType()
export class PairDayDataInput {
  @Field({ nullable: false })
  id: string
}

@InputType()
export class PairDayDatasInput {
  @Field({ nullable: false })
  id: string
}

@InputType()
export class TokenDayDataInput {
  @Field({ nullable: false })
  id: string
}