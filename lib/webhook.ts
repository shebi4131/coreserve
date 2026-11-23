/**
 * Reads an Apps Script webhook reply and decides whether the submission was saved.
 * Different deployed script versions reply with {"ok":true}, {"success":true},
 * {"status":"success"} or {"result":"success"} — all are accepted.
 */
export async function webhookConfirmedSave(response: Response) {
  if (!response.ok) return false;
  const body: unknown = await response.json().catch(() => null);
  if (!body || typeof body !== "object") return false;

  const reply = body as Record<string, unknown>;
  const isSuccessWord = (value: unknown) => typeof value === "string" && value.toLowerCase() === "success";
  return reply.ok === true || reply.success === true || isSuccessWord(reply.status) || isSuccessWord(reply.result);
}
