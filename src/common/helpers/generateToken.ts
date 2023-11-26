export function generateToken(min: number, max: number): string {
  return Math.floor(Math.random() * (max - min) + min).toString();
}
