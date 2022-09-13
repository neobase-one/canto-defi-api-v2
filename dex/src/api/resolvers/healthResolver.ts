import { Field, Int, ObjectType, Query, Resolver } from "type-graphql";
import prisma from "../../prisma";
import provider from "../../provider";
import { getBlockTimestamp } from "../../utils/helpers";

@Resolver()
export class HealthResolver {
  @Query((returns) => Health)
  async health() {
    // chain head
    const chainHeadBlockNumber = await provider.getBlockNumber();;
    const chainHeadTimestamp = await getBlockTimestamp(chainHeadBlockNumber)

    // latest indexed block
    const latestBlock = await prisma.blockSync.findFirstOrThrow({where: {id: '1'}})
    const latestIndexedBlockNumber = latestBlock.blockNumber;
    const latestIndexedBlockTimestamp = await getBlockTimestamp(latestIndexedBlockNumber);

    // sync
    var synced = false;
    if (chainHeadBlockNumber == latestIndexedBlockNumber) {
      synced = true;
    }

    // index
    const health = new Health();
    health.synced = synced;
    health.chainHeadBlockNumber = chainHeadBlockNumber;
    health.chainHeadTimestamp = chainHeadTimestamp;
    health.latestIndexedBlockNumber = latestIndexedBlockNumber;
    health.latestIndexedBlockTimestamp = latestIndexedBlockTimestamp;

    return health;
  }
}


@ObjectType()
export class Health {
  @Field((type) => Boolean, { nullable: true })
  synced: boolean

  @Field((type) => Int, { nullable: true })
  chainHeadBlockNumber: number

  @Field((type) => Int, { nullable: true })
  chainHeadTimestamp: number

  @Field((type) => Int, { nullable: true })
  latestIndexedBlockNumber: number

  @Field((type) => Int, { nullable: true })
  latestIndexedBlockTimestamp: number
}
