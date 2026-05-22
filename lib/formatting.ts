export function formatNumber(value: number): string {
  return new Intl.NumberFormat("ja-JP").format(Math.round(value));
}

export function formatCurrency(value: number): string {
  return `${formatNumber(value)}円`;
}

export function formatPeople(value: number): string {
  return `${formatNumber(value)}人`;
}
