export interface CalculatePriceParams {
  zone: "INSIDE_DHAKA" | "OUTSIDE_DHAKA";
  speed: "STANDARD" | "EXPRESS";
  weightKg: number;
}

export interface PriceBreakdown {
  basePrice: number;
  extraWeightCharge: number;
  expressCharge: number;
  total: number;
}

export function calculateDeliveryPrice({
  zone,
  speed,
  weightKg,
}: CalculatePriceParams): PriceBreakdown {
  const basePrice = zone === "INSIDE_DHAKA" ? 60 : 120;
  const safeWeight = Math.max(0.1, Number(weightKg) || 1);
  const excessWeight = Math.max(0, safeWeight - 1);
  const extraWeightCharge = Math.ceil(excessWeight) * 30; // ৳ 30 per excess kg
  const expressCharge = speed === "EXPRESS" ? 50 : 0; // ৳ 50 express premium
  const total = basePrice + extraWeightCharge + expressCharge;

  return {
    basePrice,
    extraWeightCharge,
    expressCharge,
    total,
  };
}
