"use client";

import { useRef, useState } from "react";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { Check, Close } from "@/components/icons";

/**
 * Pick a file → compress in the browser → upload straight to Cloudinary.
 *
 * The compression step is the important one. A modern phone photo is often
 * 4000px wide and 6–12MB; delivered on a page it would be resized to ~1600px
 * anyway. Shrinking before upload makes the upload fast on a phone connection
 * and keeps the Cloudinary account small, with no visible quality cost.
 *
 * Uses a canvas rather than a library — this is ~40 lines and adds no
 * dependency to the bundle.
 */

const MAX_EDGE = 2000; // px on the longest side
const QUALITY = 0.82; // JPEG quality after resize
const COMPRESS_ABOVE = 400 * 1024; // don't bother re-encoding small files

async function compress(file: File): Promise<{ blob: Blob; note: string }> {
  if (!file.type.startsWith("image/")) {
    throw new Error("That is not an image file.");
  }
  // Leave small files and vector/PNG logos alone — re-encoding a crisp logo
  // to JPEG would add artefacts and drop transparency.
  if (file.size < COMPRESS_ABOVE || file.type === "image/svg+xml") {
    return { blob: file, note: "uploaded as-is" };
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));

  if (scale === 1 && file.size < 2 * 1024 * 1024) {
    return { blob: file, note: "uploaded as-is" };
  }

  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return { blob: file, note: "uploaded as-is" };
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", QUALITY),
  );
  if (!blob || blob.size >= file.size) {
    return { blob: file, note: "uploaded as-is" };
  }

  const pct = Math.round((1 - blob.size / file.size) * 100);
  return {
    blob,
    note: `${(file.size / 1024 / 1024).toFixed(1)}MB → ${(blob.size / 1024 / 1024).toFixed(1)}MB (${pct}% smaller), ${w}×${h}`,
  };
}

export function ImageUpload({
  folder,
  value,
  onChange,
  label,
  aspect = "4/3",
}: {
  folder: string;
  value: string | null;
  onChange: (publicId: string | null) => void;
  label: string;
  aspect?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setBusy(true);
    setError(null);
    setNote("Preparing…");

    try {
      const { blob, note: compressNote } = await compress(file);
      setNote(`Compressed: ${compressNote}. Uploading…`);

      const sigRes = await fetch("/api/admin/upload-signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder }),
      });
      if (!sigRes.ok) {
        const b = await sigRes.json().catch(() => ({}));
        throw new Error(b.error ?? "Could not get an upload signature.");
      }
      const sig = await sigRes.json();

      const form = new FormData();
      form.append("file", blob);
      form.append("api_key", sig.apiKey);
      form.append("timestamp", String(sig.timestamp));
      form.append("folder", sig.folder);
      form.append("signature", sig.signature);

      const upRes = await fetch(
        `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
        { method: "POST", body: form },
      );
      const data = await upRes.json();
      if (!upRes.ok || !data.public_id) {
        throw new Error(data?.error?.message ?? "Cloudinary rejected the upload.");
      }

      onChange(data.public_id);
      setNote(`Uploaded. ${compressNote}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
      setNote(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <p className="stamp text-carbon-500">{label}</p>

      <div
        className="mt-3 border-2 border-dashed border-carbon-700 bg-carbon-900"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f) handleFile(f);
        }}
      >
        {value ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cloudinaryUrl(value, { width: 600 })}
              alt=""
              style={{ aspectRatio: aspect }}
              className="w-full bg-carbon-950 object-cover"
            />
            <button
              type="button"
              onClick={() => {
                onChange(null);
                setNote(null);
              }}
              className="absolute right-2 top-2 grid h-8 w-8 place-items-center bg-siren-600 text-white transition-colors hover:bg-siren-500"
              aria-label="Remove image"
            >
              <Close className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => input.current?.click()}
            disabled={busy}
            className="flex w-full flex-col items-center justify-center gap-2 px-6 py-10 text-center transition-colors hover:bg-carbon-850 disabled:opacity-60"
          >
            <span className="font-display text-lg uppercase tracking-tight text-paper-100">
              {busy ? "Working…" : "Choose or drop an image"}
            </span>
            <span className="stamp text-carbon-500">
              Large photos are shrunk automatically
            </span>
          </button>
        )}
      </div>

      <input
        ref={input}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />

      {value ? (
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={busy}
          className="stamp mt-2 border border-carbon-700 px-3 py-1.5 text-carbon-400 transition-colors hover:border-hivis-400 hover:text-hivis-400"
        >
          Replace
        </button>
      ) : null}

      {note ? (
        <p className="stamp mt-2 flex items-center gap-2 text-carbon-500">
          {!busy ? <Check className="h-3 w-3 text-hivis-400" /> : null}
          {note}
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="stamp mt-2 text-siren-500">
          {error}
        </p>
      ) : null}
      {value ? (
        <p className="stamp mt-1 break-all text-carbon-600">{value}</p>
      ) : null}
    </div>
  );
}
