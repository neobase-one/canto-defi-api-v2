import { Decimal } from "@prisma/client/runtime";

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

// export let ZERO_BI = BigInt.fromI32(0)
// export let ONE_BI = BigInt.fromI32(1)
export const ZERO_BD = new Decimal("0");
export const NEG_ONE_DB = new Decimal("-1");
export const ONE_BD = new Decimal("1");
export let BI_18 = 18;
export const HUNDRED_DB = new Decimal("100");
export const SECONDS_IN_DAY = 24 * 60 * 60;
export const DAYS_IN_YEAR = 365;
