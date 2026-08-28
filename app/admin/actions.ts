"use server";

import { revalidatePath } from "next/cache";
import {
  checkAccessCode,
  createSession,
  destroySession,
  isAuthenticated,
} from "@/lib/admin-auth";
import { setLeadStatus, type LeadStatus } from "@/lib/db";

export type LoginState = { error?: string };

/** Deliberately vague on failure — never reveal whether a code is configured. */
export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const code = String(formData.get("code") ?? "");

  if (!checkAccessCode(code)) {
    // Small delay blunts trivial online guessing without needing a store.
    await new Promise((r) => setTimeout(r, 600));
    return { error: "That code was not accepted." };
  }

  await createSession();
  revalidatePath("/admin");
  return {};
}

export async function logout(): Promise<void> {
  await destroySession();
  revalidatePath("/admin");
}

/** Every mutation re-checks the session — never trust the caller. */
export async function updateStatus(formData: FormData): Promise<void> {
  if (!(await isAuthenticated())) return;

  const id = Number(formData.get("id"));
  const status = String(formData.get("status")) as LeadStatus;
  if (!Number.isFinite(id)) return;

  await setLeadStatus(id, status);
  revalidatePath("/admin");
}
