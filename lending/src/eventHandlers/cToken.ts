import config from "../config";

export async function handleBorrow(log: any) {
    const event = config.canto.contracts.cToken.interface.parseLog(log);
}

export async function handleRepayBorrow(log: any) {
    const event = config.canto.contracts.cToken.interface.parseLog(log);
}

export async function handleLiquidateBorrow(log: any) {
    const event = config.canto.contracts.cToken.interface.parseLog(log);
}

export async function handleAccrueInterest(log: any) {
    const event = config.canto.contracts.cToken.interface.parseLog(log);
}

export async function handleNewReserveFactor(log: any) {
    const event = config.canto.contracts.cToken.interface.parseLog(log);
}

export async function handleTransfer(log: any) {
    const event = config.canto.contracts.cToken.interface.parseLog(log);
}

export async function handleNewMarketInterestRateModel(log: any) {
    const event = config.canto.contracts.cToken.interface.parseLog(log);
}