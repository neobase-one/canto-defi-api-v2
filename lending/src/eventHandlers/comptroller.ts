import { Config } from "../config";

export async function handleMarketListed(log: any) {
  const event = Config.canto.contracts.comptroller.interface.parseLog(log);
  console.log(event);
  //TODO : Function Implementation
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
