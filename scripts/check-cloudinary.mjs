#!/usr/bin/env node
/**
 * Verify a Cloudinary cloud name actually works.
 *
 *   node scripts/check-cloudinary.mjs                 # reads .env.local
 *   node scripts/check-cloudinary.mjs my-cloud-name
 *   node scripts/check-cloudinary.mjs my-cloud jck/team/curtis
 *
 * Every new Cloudinary account ships with a `sample` image, so we can prove
 * the account resolves and delivers transformed images without needing any
 * uploads first. Pass a public ID to check one of your own assets instead.
 */

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function envValue(key) {
  if (process.env[key]) return process.env[key];
  const file = join(root, ".env.local");
  if (!existsSync(file)) return null;
  const line = readFileSync(file, "utf8")
    .split(/\r?\n/)
    .find((l) => l.startsWith(`${key}=`));
  return line ? line.slice(key.length + 1).trim() : null;
}

const cloud = process.argv[2] || envValue("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME");
const publicId = process.argv[3] || "sample";

if (!cloud) {
  console.error(
    "No cloud name.\n" +
      "  Pass one:  node scripts/check-cloudinary.mjs <cloud-name>\n" +
      "  Or set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in .env.local",
  );
  process.exit(1);
}

console.log(`Cloud name: ${cloud}`);
console.log(`Public ID:  ${publicId}\n`);

const checks = [
  { label: "raw delivery", url: `https://res.cloudinary.com/${cloud}/image/upload/${publicId}` },
  { label: "f_auto,q_auto", url: `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto/${publicId}` },
  { label: "resized w_400", url: `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto,w_400,c_limit/${publicId}` },
  { label: "blur placeholder", url: `https://res.cloudinary.com/${cloud}/image/upload/w_24,q_10,e_blur:400,f_auto/${publicId}` },
];

let failures = 0;

for (const { label, url } of checks) {
  try {
    const res = await fetch(url, { redirect: "follow" });
    const type = res.headers.get("content-type") ?? "";
    const size = res.headers.get("content-length");
    const ok = res.ok && type.startsWith("image/");

    if (ok) {
      console.log(
        `  ok    ${label.padEnd(18)} ${type}${size ? `, ${Math.round(size / 1024)}KB` : ""}`,
      );
    } else {
      failures++;
      console.log(`  FAIL  ${label.padEnd(18)} HTTP ${res.status} ${type}`);
    }
  } catch (err) {
    failures++;
    console.log(`  FAIL  ${label.padEnd(18)} ${err.message}`);
  }
}

console.log();
if (failures === 0) {
  console.log("Cloudinary is working. Delivery, format negotiation, resizing");
  console.log("and blur placeholders all return real images.");
} else if (publicId === "sample") {
  console.log("Failed. Most likely causes, in order:");
  console.log("  1. The cloud name is wrong — check the Cloudinary dashboard.");
  console.log("  2. The account is brand new and the `sample` asset was removed.");
  console.log("     Upload any image and re-run with its public ID.");
  process.exit(1);
} else {
  console.log(`Failed. Check that "${publicId}" exists in this account and is`);
  console.log("not restricted — Cloudinary 404s on unknown public IDs.");
  process.exit(1);
}
