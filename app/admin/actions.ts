"use server";

import { revalidatePath } from "next/cache";
import {
  checkAccessCode,
  createSession,
  destroySession,
  isAuthenticated,
} from "@/lib/admin-auth";
import {
  setLeadStatus,
  upsertProject,
  upsertReview,
  deleteProject,
  deleteReview,
  setSetting,
  type LeadStatus,
  type Review,
} from "@/lib/db";
import { destroyAsset } from "@/lib/cloudinary-upload";

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

/* ---------------------------------------------------------------------------
   Content actions. Every one re-checks the session — the client is never
   trusted, even though the UI is only reachable behind the gate.
   ------------------------------------------------------------------------ */

function str(fd: FormData, k: string) {
  return String(fd.get(k) ?? "").trim();
}
function nullable(fd: FormData, k: string) {
  const v = str(fd, k);
  return v === "" ? null : v;
}

/** Slugify a title so gallery URLs stay predictable. */
function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

export async function saveProject(formData: FormData): Promise<void> {
  if (!(await isAuthenticated())) return;

  const id = Number(formData.get("id")) || undefined;
  const title = str(formData, "title");
  const before = str(formData, "before_public_id");
  const after = str(formData, "after_public_id");

  // Both photos are the entire point of a before/after entry.
  if (!title || !before || !after) return;

  await upsertProject({
    id,
    slug: str(formData, "slug") || slugify(title),
    title,
    city: str(formData, "city"),
    service: nullable(formData, "service"),
    situation: nullable(formData, "situation"),
    work: nullable(formData, "work"),
    days: formData.get("days") ? Number(formData.get("days")) : null,
    before_public_id: before,
    before_alt: str(formData, "before_alt"),
    after_public_id: after,
    after_alt: str(formData, "after_alt"),
    published: formData.get("published") === "on",
    sort_order: Number(formData.get("sort_order")) || 0,
  });

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

export async function removeProject(formData: FormData): Promise<void> {
  if (!(await isAuthenticated())) return;
  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) return;

  // Delete the row first, then the images it pointed at, so a Cloudinary
  // failure cannot leave a row referencing a deleted asset.
  const orphaned = await deleteProject(id);
  for (const publicId of orphaned) await destroyAsset(publicId);

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

export async function saveReview(formData: FormData): Promise<void> {
  if (!(await isAuthenticated())) return;

  const author = str(formData, "author");
  const body = str(formData, "body");
  if (!author || !body) return;

  const rating = Math.min(5, Math.max(1, Number(formData.get("rating")) || 5));
  const source = str(formData, "source") as Review["source"];

  await upsertReview({
    id: Number(formData.get("id")) || undefined,
    author,
    rating: rating as Review["rating"],
    body,
    city: nullable(formData, "city"),
    service: nullable(formData, "service"),
    source: ["google", "direct", "facebook"].includes(source) ? source : "direct",
    reviewed_on: nullable(formData, "reviewed_on"),
    published: formData.get("published") === "on",
    sort_order: Number(formData.get("sort_order")) || 0,
  });

  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
  revalidatePath("/");
}

export async function removeReview(formData: FormData): Promise<void> {
  if (!(await isAuthenticated())) return;
  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) return;
  await deleteReview(id);
  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
  revalidatePath("/");
}

export async function saveLogo(formData: FormData): Promise<void> {
  if (!(await isAuthenticated())) return;

  const next = str(formData, "logo_public_id");
  const previous = str(formData, "previous_public_id");

  await setSetting("logo_public_id", next || null);
  await setSetting("logo_alt", str(formData, "logo_alt") || null);

  // Remove the superseded asset so the account does not fill with dead logos.
  if (previous && previous !== next) await destroyAsset(previous);

  revalidatePath("/admin/branding");
  revalidatePath("/", "layout");
}
