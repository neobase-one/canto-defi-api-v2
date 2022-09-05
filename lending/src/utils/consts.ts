import { Prisma } from '@prisma/client'
import { Config } from '../config';

export const ZERO_PD = new Prisma.Decimal(0);
export const ONE_PD = new Prisma.Decimal(1);
export const D_10_18 = Prisma.Decimal.pow(10, 18);

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

export const cTOKEN_DECIMALS = Config.canto.lendingDashboard.cTOKEN_DECIMALS;
export const cTOKEN_DECIMALS_PD = Prisma.Decimal.pow(10, Config.canto.lendingDashboard.cTOKEN_DECIMALS);

export const MANTISSA_FACTOR = Config.canto.lendingDashboard.MANTISSA_FACTOR;
export const MANTISSA_FACTOR_PD = Prisma.Decimal.pow(10, Config.canto.lendingDashboard.MANTISSA_FACTOR);

export const cCANTO_ADDRESS = Config.canto.lendingDashboard.cCANTO_ADDRESS;
export const cUSDC_ADDRESS = Config.canto.lendingDashboard.cUSDC_ADDRESS;
