import config from "../config";

export async function handleBorrow(log: any) {
    const event = config.canto.contracts.cToken.interface.parseLog(log);
    //TODO : Function Implementation
}

export async function handleRepayBorrow(log: any) {
    const event = config.canto.contracts.cToken.interface.parseLog(log);
    //TODO : Function Implementation
}

export async function handleLiquidateBorrow(log: any) {
    const event = config.canto.contracts.cToken.interface.parseLog(log);
    //TODO : Function Implementation
}

export async function handleAccrueInterest(log: any) {
    const event = config.canto.contracts.cToken.interface.parseLog(log);
    //TODO : Function Implementation
}

export async function handleNewReserveFactor(log: any) {
    const event = config.canto.contracts.cToken.interface.parseLog(log);
    //TODO : Function Implementation
}

export async function handleTransfer(log: any) {
    const event = config.canto.contracts.cToken.interface.parseLog(log);
    //TODO : Function Implementation
}

export async function handleNewMarketInterestRateModel(log: any) {
    const event = config.canto.contracts.cToken.interface.parseLog(log);
    //TODO : Function Implementation
}