import { Prisma } from "@prisma/client";
import { Arg, Query, Resolver } from "type-graphql";
import prisma from "../../prisma";
import { OrderDirection, TransactionInput, TransactionsInput } from "../schema/input";
import { Transaction } from "../schema/transaction";

@Resolver(Transaction)
export class TransactionsResolver {
  @Query(returns => Transaction)
  async transaction(@Arg("input") input: TransactionInput) {
    const transaction = prisma.transaction.findUnique( {where: {id: input.id}, include: {
      mints: true,
      burns: true,
      swaps: true
    }})
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
        include: {
          mints: true,
          burns: true,
          swaps: true
        }
      });
      return transactions
    } else {
      const transactions = await prisma.transaction.findMany({
        orderBy: {
          [input.orderBy.trim()]: od
        },
        take: input.first,
        include: {
          mints: true,
          burns: true,
          swaps: true
        }
      });
      return transactions
    }
  }
}