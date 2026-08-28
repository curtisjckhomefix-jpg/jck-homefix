"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/admin/image-upload";
import { saveLogo } from "../actions";

export function LogoForm({
  initialPublicId,
  initialAlt,
}: {
  initialPublicId: string | null;
  initialAlt: string;
}) {
  const [publicId, setPublicId] = useState<string | null>(initialPublicId);

  return (
    <form action={saveLogo} className="max-w-xl">
      {/* Carried through so the action can delete the superseded asset */}
      <input type="hidden" name="previous_public_id" value={initialPublicId ?? ""} />
      <input type="hidden" name="logo_public_id" value={publicId ?? ""} />

      <ImageUpload
        folder="jck/brand"
        value={publicId}
        onChange={setPublicId}
        label="Logo"
        aspect="3/1"
      />

      <div className="mt-6">
        <label htmlFor="logo_alt" className="stamp block text-carbon-500">
          Alt text
        </label>
        <input
          id="logo_alt"
          name="logo_alt"
          defaultValue={initialAlt}
          placeholder="JCK HomeFix America"
          className="mt-2 w-full border-2 border-carbon-700 bg-carbon-900 px-4 py-3 text-paper-50 transition-colors focus:border-hivis-400 focus:outline-none"
        />
        <p className="stamp mt-2 text-carbon-600">
          Describes the logo for screen readers. Usually just the business name.
        </p>
      </div>

      <button
        type="submit"
        className="mt-8 bg-hivis-400 px-7 py-4 font-display text-lg uppercase tracking-tight text-carbon-950 transition-colors hover:bg-hivis-300"
      >
        Save logo
      </button>

      <p className="stamp mt-4 text-carbon-600">
        Replacing the logo deletes the old file from Cloudinary.
      </p>
    </form>
  );
}
