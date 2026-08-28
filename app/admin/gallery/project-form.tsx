"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/admin/image-upload";
import { saveProject, removeProject } from "../actions";
import type { Project } from "@/lib/db";

const input =
  "w-full border-2 border-carbon-700 bg-carbon-900 px-4 py-3 text-paper-50 transition-colors focus:border-hivis-400 focus:outline-none";
const label = "stamp block text-carbon-500";

export function ProjectForm({
  project,
  services,
  cities,
  onDone,
}: {
  project?: Project;
  services: string[];
  cities: string[];
  onDone?: () => void;
}) {
  const [before, setBefore] = useState<string | null>(
    project?.before_public_id ?? null,
  );
  const [after, setAfter] = useState<string | null>(
    project?.after_public_id ?? null,
  );

  const ready = Boolean(before && after);

  return (
    <form action={saveProject} onSubmit={onDone} className="border-2 border-carbon-700 p-6">
      {project ? <input type="hidden" name="id" value={project.id} /> : null}
      <input type="hidden" name="before_public_id" value={before ?? ""} />
      <input type="hidden" name="after_public_id" value={after ?? ""} />

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <ImageUpload
            folder="jck/projects"
            value={before}
            onChange={setBefore}
            label="Before photo"
          />
          <div className="mt-3">
            <label htmlFor={`ba-${project?.id ?? "new"}`} className={label}>
              Before — alt text
            </label>
            <input
              id={`ba-${project?.id ?? "new"}`}
              name="before_alt"
              defaultValue={project?.before_alt ?? ""}
              placeholder="Buckled hallway hardwood with standing water"
              className={`${input} mt-2`}
            />
          </div>
        </div>

        <div>
          <ImageUpload
            folder="jck/projects"
            value={after}
            onChange={setAfter}
            label="After photo"
          />
          <div className="mt-3">
            <label htmlFor={`aa-${project?.id ?? "new"}`} className={label}>
              After — alt text
            </label>
            <input
              id={`aa-${project?.id ?? "new"}`}
              name="after_alt"
              defaultValue={project?.after_alt ?? ""}
              placeholder="The same hallway after drying, with replaced flooring"
              className={`${input} mt-2`}
            />
          </div>
        </div>
      </div>

      <p className="stamp mt-4 text-carbon-600">
        Shoot both from the same position — a pair taken from different angles
        reads as a trick.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor={`t-${project?.id ?? "new"}`} className={label}>
            Title
          </label>
          <input
            id={`t-${project?.id ?? "new"}`}
            name="title"
            required
            defaultValue={project?.title ?? ""}
            placeholder="Burst supply line, upstairs bathroom"
            className={`${input} mt-2`}
          />
        </div>

        <div>
          <label htmlFor={`c-${project?.id ?? "new"}`} className={label}>
            City
          </label>
          <input
            id={`c-${project?.id ?? "new"}`}
            name="city"
            list="admin-cities"
            defaultValue={project?.city ?? ""}
            className={`${input} mt-2`}
          />
          <datalist id="admin-cities">
            {cities.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>

        <div>
          <label htmlFor={`s-${project?.id ?? "new"}`} className={label}>
            Service
          </label>
          <select
            id={`s-${project?.id ?? "new"}`}
            name="service"
            defaultValue={project?.service ?? ""}
            className={`${input} mt-2`}
          >
            <option value="">Not specified</option>
            {services.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={`si-${project?.id ?? "new"}`} className={label}>
            What went wrong
          </label>
          <textarea
            id={`si-${project?.id ?? "new"}`}
            name="situation"
            rows={2}
            defaultValue={project?.situation ?? ""}
            className={`${input} mt-2 resize-y`}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={`w-${project?.id ?? "new"}`} className={label}>
            What was done
          </label>
          <textarea
            id={`w-${project?.id ?? "new"}`}
            name="work"
            rows={2}
            defaultValue={project?.work ?? ""}
            className={`${input} mt-2 resize-y`}
          />
        </div>

        <div>
          <label htmlFor={`d-${project?.id ?? "new"}`} className={label}>
            Days to dry
          </label>
          <input
            id={`d-${project?.id ?? "new"}`}
            name="days"
            type="number"
            min={1}
            max={60}
            defaultValue={project?.days ?? ""}
            className={`${input} mt-2`}
          />
        </div>

        <div>
          <label htmlFor={`o-${project?.id ?? "new"}`} className={label}>
            Sort order
          </label>
          <input
            id={`o-${project?.id ?? "new"}`}
            name="sort_order"
            type="number"
            defaultValue={project?.sort_order ?? 0}
            className={`${input} mt-2`}
          />
          <p className="stamp mt-2 text-carbon-600">Lower shows first</p>
        </div>
      </div>

      <label className="mt-7 flex cursor-pointer items-center gap-3 border-2 border-carbon-700 px-4 py-3">
        <input
          type="checkbox"
          name="published"
          defaultChecked={project?.published ?? false}
          className="h-4 w-4 accent-hivis-500"
        />
        <span className="text-sm text-paper-100">
          Published — visible on the public site
        </span>
      </label>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={!ready}
          className="bg-hivis-400 px-7 py-4 font-display text-lg uppercase tracking-tight text-carbon-950 transition-colors hover:bg-hivis-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {project ? "Save changes" : "Add project"}
        </button>
        {!ready ? (
          <span className="stamp text-carbon-500">
            Both photos are required
          </span>
        ) : null}
      </div>
    </form>
  );
}

export function DeleteProject({ id }: { id: number }) {
  return (
    <form action={removeProject}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="stamp border border-carbon-700 px-3 py-1.5 text-carbon-400 transition-colors hover:border-siren-500 hover:text-siren-500"
      >
        Delete
      </button>
    </form>
  );
}
