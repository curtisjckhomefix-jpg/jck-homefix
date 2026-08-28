#!/usr/bin/env node
/**
 * Verify a Cloudinary cloud name actually works.
 *
 *   node scripts/check-cloudinary.mjs                        # reads .env.local
 *   node scripts/check-cloudinary.mjs my-cloud
 *   node scripts/check-cloudinary.mjs my-cloud jck/team/curtis
 *
 * Checks the cloud name resolves, then fetches one asset through four
 * delivery URLs — raw, `f_auto,q_auto`, a resize, and a blur placeholder — to
 * prove transformations work rather than just that the host answers.
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

const url = (cloud, transform, id) =>
  `https://res.cloudinary.com/${cloud}/image/upload/${transform ? transform + "/" : ""}${id}`;

async function main() {
  const cloud = process.argv[2] || envValue("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME");
  const publicId = process.argv[3] || "sample";

  if (!cloud) {
    console.error(
      "No cloud name.\n" +
        "  Pass one:  node scripts/check-cloudinary.mjs <cloud-name>\n" +
        "  Or set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in .env.local",
    );
    return 1;
  }

  console.log(`Cloud name: ${cloud}`);
  console.log(`Public ID:  ${publicId}\n`);

  /**
   * Separate "wrong cloud name" from "asset not found" up front — as bare
   * 404s they look identical but need opposite fixes.
   *
   * A VALID cloud returns Cloudinary's 1x1 GIF placeholder (`image/gif`) for
   * a missing asset; an INVALID cloud returns an HTML error page. Verified
   * against a known-good cloud, a known-bad one, and this project's account.
   */
  const probe = await fetch(
    url(cloud, "", `__probe_${Date.now()}`),
  ).catch(() => null);

  const cloudResolves =
    probe !== null &&
    (probe.headers.get("content-type") ?? "").startsWith("image/");

  if (!cloudResolves) {
    console.log("  FAIL  cloud name does not resolve\n");
    console.log(`No Cloudinary account is served at "${cloud}".`);
    console.log("Check the Cloud name on your Cloudinary dashboard — it is the");
    console.log("short string shown there, not your account email.");
    return 1;
  }

  console.log("  ok    cloud name resolves");

  const checks = [
    ["raw delivery", ""],
    ["f_auto,q_auto", "f_auto,q_auto"],
    ["resized w_400", "f_auto,q_auto,w_400,c_limit"],
    ["blur placeholder", "w_24,q_10,e_blur:400,f_auto"],
  ];

  let failures = 0;

  for (const [label, transform] of checks) {
    try {
      const res = await fetch(url(cloud, transform, publicId), {
        redirect: "follow",
      });
      const type = res.headers.get("content-type") ?? "";
      const size = res.headers.get("content-length");

      if (res.ok && type.startsWith("image/")) {
        const kb = size ? `, ${Math.round(size / 1024)}KB` : "";
        console.log(`  ok    ${label.padEnd(18)} ${type}${kb}`);
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
    return 0;
  }

  console.log(`The cloud name is fine, but "${publicId}" is not in it.`);
  if (publicId === "sample") {
    console.log();
    console.log("`sample` is Cloudinary's demo asset. Newer accounts ship");
    console.log("without it, so this is expected on a fresh account and does");
    console.log("NOT mean anything is broken.");
  }
  console.log();
  console.log("Upload an image, then re-run with its exact public ID:");
  console.log(`  pnpm check-cloudinary ${cloud} <public-id>`);
  console.log();
  console.log("A public ID includes any folder path and excludes the file");
  console.log("extension — e.g. `jck/brand/mark`, not `mark.png`.");
  return 1;
}

// Set exitCode rather than calling process.exit(): exiting while a fetch is
// still settling makes Node abort with a libuv assertion on Windows.
process.exitCode = await main();
