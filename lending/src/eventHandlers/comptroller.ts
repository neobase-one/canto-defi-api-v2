import prisma from "../prisma";
import { Config } from "../config";
import { createMarket } from "../utils/helper";

export async function handleMarketListed(log: any) {
  const event = Config.canto.contracts.comptroller.interface.parseLog(log);
  let address = event.args.cToken;
  console.log(event, address);

  let market = await createMarket(address);
  await prisma.market.upsert({
    where: {
      id: address
    },
    update: {},
    create: market
  });

}

export async function handleMarketEntered(log: any) {
  const event = Config.canto.contracts.comptroller.interface.parseLog(log);
  //TODO : Function Implementation
}

export async function handleMarketExited(log: any) {
  const event = Config.canto.contracts.comptroller.interface.parseLog(log);
  //TODO : Function Implementation
}

export async function handleNewCloseFactor(log: any) {
  const event = Config.canto.contracts.comptroller.interface.parseLog(log);
  //TODO : Function Implementation
}

export async function handleNewCollateralFactor(log: any) {
  const event = Config.canto.contracts.comptroller.interface.parseLog(log);
  //TODO : Function Implementation
}

export async function handleNewLiquidationIncentive(log: any) {
  const event = Config.canto.contracts.comptroller.interface.parseLog(log);
  //TODO : Function Implementation
}

export async function handleNewPriceOracle(log: any) {
  const event = Config.canto.contracts.comptroller.interface.parseLog(log);
  //TODO : Function Implementation
}
