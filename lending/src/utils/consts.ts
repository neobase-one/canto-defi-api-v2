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

export let B_18 = 18;
export const HUNDRED_PD = new Prisma.Decimal("100");
export const SECONDS_IN_DAY = 24 * 60 * 60;
export const SECONDS_IN_DAY_PD = new Prisma.Decimal(SECONDS_IN_DAY);
export const DAYS_IN_YEAR = 365;
export const DAYS_IN_YEAR_PD = new Prisma.Decimal(DAYS_IN_YEAR);

export const MAX_BLOCK_WINDOW_SIZE = Config.canto.BLOCK_LOOKUP_WINDOW;
