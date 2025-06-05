export async function getUserCredits(email: string) {
  const res = await fetch(`${process.env.CF_WORKER_URL}/credits?email=${encodeURIComponent(email)}`, {
    headers: {
      Authorization: `Bearer ${process.env.CF_API_TOKEN}`,
    },
  });
  if (!res.ok) {
    throw new Error('Unable to fetch credits');
  }
  const data = await res.json();
  return data.credits;
}

export async function updateUserCredits(email: string, delta: number) {
  await fetch(`${process.env.CF_WORKER_URL}/credits`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.CF_API_TOKEN}`,
    },
    body: JSON.stringify({ email, delta }),
  });
}
