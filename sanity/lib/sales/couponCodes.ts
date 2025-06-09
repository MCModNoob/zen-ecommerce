export const COUPON_CODES = {
    BFDEMO: "BFDEMO",
} as const;

export type CouponCode = keyof typeof COUPON_CODES