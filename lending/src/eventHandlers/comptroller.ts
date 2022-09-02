import config from "../config";

export async function handleMarketListed(log: any) {
  const event = config.canto.contracts.comptroller.interface.parseLog(log);
}

export async function handleMarketEntered(log: any) {
  const event = config.canto.contracts.comptroller.interface.parseLog(log);
}

export async function handleMarketExited(log: any) {
  const event = config.canto.contracts.comptroller.interface.parseLog(log);
}

export async function handleNewCloseFactor(log: any) {
  const event = config.canto.contracts.comptroller.interface.parseLog(log);
}

export async function handleNewCollateralFactor(log: any) {
  const event = config.canto.contracts.comptroller.interface.parseLog(log);
}

export async function handleNewLiquidationIncentive(log: any) {
  const event = config.canto.contracts.comptroller.interface.parseLog(log);
}

export async function handleNewPriceOracle(log: any) {
  const event = config.canto.contracts.comptroller.interface.parseLog(log);
}