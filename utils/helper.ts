import { getUserCredits as cfGetCredits, updateUserCredits } from '../lib/cloudflare';

export async function getUserIdByEmail(email: string) {
  return email;
}

export async function decreaseUserCredits(email: string) {
  await updateUserCredits(email, -1);
}

export async function addUserCredits(email: string, credit_amount: number) {
  await updateUserCredits(email, credit_amount);
}

export async function getUserCredits(email: string) {
  return await cfGetCredits(email);
}
