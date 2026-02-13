// Tasas de conversión relativas a USD
// Actualizar periódicamente con tasas reales
// Para actualizar: visita https://www.xe.com o usa tu API de cambio preferida
// Última actualización: Febrero 2026
export const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  CLP: 950, // 1 USD = ~950 CLP (actualizar según tasa actual)
  EUR: 0.92, // 1 USD = ~0.92 EUR
  GBP: 0.79, // 1 USD = ~0.79 GBP
  MXN: 17.5, // 1 USD = ~17.5 MXN
  ARS: 1000, // 1 USD = ~1000 ARS
  BRL: 5.0, // 1 USD = ~5.0 BRL
  COP: 4000, // 1 USD = ~4000 COP
};

export const SUPPORTED_CURRENCIES = [
  { value: "USD", label: "USD ($)", symbol: "$" },
  { value: "CLP", label: "CLP (Peso Chileno)", symbol: "CLP" },
  { value: "EUR", label: "EUR (€)", symbol: "€" },
  { value: "GBP", label: "GBP (£)", symbol: "£" },
  { value: "MXN", label: "MXN (Peso Mexicano)", symbol: "$" },
  { value: "ARS", label: "ARS (Peso Argentino)", symbol: "$" },
  { value: "BRL", label: "BRL (Real)", symbol: "R$" },
  { value: "COP", label: "COP (Peso Colombiano)", symbol: "$" },
];

/**
 * Convierte un monto de una moneda a otra
 * @param amount Monto a convertir
 * @param fromCurrency Moneda de origen
 * @param toCurrency Moneda de destino
 * @returns Monto convertido
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  if (fromCurrency === toCurrency) return amount;

  const fromRate = EXCHANGE_RATES[fromCurrency] ?? 1;
  const toRate = EXCHANGE_RATES[toCurrency] ?? 1;

  // Convertir a USD primero, luego a la moneda destino
  const amountInUSD = amount / fromRate;
  const convertedAmount = amountInUSD * toRate;

  return convertedAmount;
}

/**
 * Formatea múltiples montos en diferentes monedas mostrando el original y convertido
 * @param items Array de { amount, currency }
 * @param displayCurrency Moneda en la que mostrar el total
 * @returns Total convertido
 */
export function convertMultipleCurrencies(
  items: Array<{ amount: number; currency: string }>,
  displayCurrency: string
): number {
  return items.reduce((total, item) => {
    const converted = convertCurrency(item.amount, item.currency, displayCurrency);
    return total + converted;
  }, 0);
}
