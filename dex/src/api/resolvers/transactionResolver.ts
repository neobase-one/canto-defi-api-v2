import { Prisma } from "@prisma/client";
import { Arg, Query, Resolver } from "type-graphql";
import prisma from "../../prisma";
import { OrderDirection, TransactionInput, TransactionsInput } from "../schema/input";
import { Transaction } from "../schema/transaction";

@Resolver(Transaction)
export class TransactionsResolver {
  @Query(returns => Transaction)
  async transaction(@Arg("input") input: TransactionInput) {
    const transaction = prisma.transaction.findUnique( {where: {id: input.id}})
    return transaction;
  }
  
  @Query(returns => [Transaction])
  async transactions(@Arg("input") input: TransactionsInput) {
    let od = (input.orderDirection == OrderDirection.ASC) ? Prisma.SortOrder.asc: Prisma.SortOrder.desc;
    if (input.id!==undefined) {
      const transactions = await prisma.transaction.findMany({
        where: {
          id: {
            in: input.id
          }
        }, 
        orderBy: {
          [input.orderBy.trim()]: od
        },
      });
      return transactions
    } else {
      const transactions = await prisma.transaction.findMany({
        orderBy: {
          [input.orderBy.trim()]: od
        },
        take: input.first
      });
      return transactions
    }
  }
  
  // @FieldResolver()
  // async mints(@Root() transaction: Transaction) {
  //   const transactionDb = await TransactionModel.findOne({ id: transaction.id });
  //   const t = transactionDb as unknown as TransactionDb;
  //   if (t.mints !== []) {
  //     const mintDbs = await MintModel.find({ id: t.mints });
  //     let mints: Mint[] = [];
  //     for (var mintDb of mintDbs) {
  //       let mint = await mintDb.toGenerated();
  //       mints.push(mint);
  //     }
  //     return mints;
  //   }
  // }
  // @FieldResolver()
  // async burns(@Root() transaction: Transaction) {
  //   const transactionDb = await TransactionModel.findOne({ id: transaction.id });
  //   const t = transactionDb as unknown as TransactionDb;
  //   if (t.burns !== []) {
  //     const burnDbs = await BurnModel.find({ id: t.burns });
  //     let burns: Burn[] = [];
  //     for (var burnDb of burnDbs) {
  //       let burn = await burnDb.toGenerated();
  //       burns.push(burn);
  //     }
  //     return burns;
  //   }
  // }
  // @FieldResolver()
  // async swaps(@Root() transaction: Transaction) {
  //   const transactionDb = await TransactionModel.findOne({ id: transaction.id });
  //   const t = transactionDb as unknown as TransactionDb;
  //   if (t.swaps !== []) {
  //     const swapDbs = await SwapModel.find({ id: t.swaps });
  //     let swaps: Swap[] = [];
  //     for (var swapDb of swapDbs) {
  //       let swap = await swapDb.toGenerated();
  //       swaps.push(swap);
  //     }
  //     return swaps;
  //   }
  // }
}