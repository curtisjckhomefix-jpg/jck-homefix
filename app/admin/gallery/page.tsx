import type { Metadata } from "next";
import Image from "next/image";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProjectForm, DeleteProject } from "./project-form";
import { getAllProjects } from "@/lib/db";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { isUploadConfigured } from "@/lib/cloudinary-upload";
import { services } from "@/lib/services";
import { areas } from "@/lib/areas";

export const metadata: Metadata = {
  title: "Before & After",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  let projects: Awaited<ReturnType<typeof getAllProjects>> = [];
  let error: string | null = null;
  try {
    projects = await getAllProjects();
  } catch (err) {
    error = err instanceof Error ? err.message : "Database unavailable";
  }

  const serviceNames = services.map((s) => s.name);
  const cityNames = areas.map((a) => a.city);
  const published = projects.filter((p) => p.published).length;

  return (
    <AdminShell
      title="Before & After"
      intro={`Photos of real completed jobs. Nothing appears on the public site until you tick Published. ${published} of ${projects.length} published.`}
    >
      {!isUploadConfigured ? (
        <div className="mb-8 border-2 border-siren-500 p-6">
          <p className="leading-relaxed text-carbon-300">
            Uploads need{" "}
            <code className="font-mono text-hivis-400">CLOUDINARY_API_KEY</code>{" "}
            and{" "}
            <code className="font-mono text-hivis-400">
              CLOUDINARY_API_SECRET
            </code>{" "}
            in Vercel. Server-only — never prefixed with{" "}
            <code className="font-mono">NEXT_PUBLIC_</code>.
          </p>
        </div>
      ) : null}

      {error ? (
        <div className="mb-8 border-2 border-siren-500 p-6">
          <p className="font-mono text-sm text-siren-500">{error}</p>
        </div>
      ) : null}

      <section className="mb-14">
        <h2 className="stamp mb-4 text-hivis-400">Add a project</h2>
        <ProjectForm services={serviceNames} cities={cityNames} />
      </section>

      <section>
        <h2 className="stamp mb-4 text-hivis-400">
          Existing ({projects.length})
        </h2>

        {projects.length === 0 ? (
          <div className="border-2 border-dashed border-carbon-700 p-10 text-center">
            <p className="font-display text-2xl uppercase tracking-tight text-paper-50">
              No projects yet
            </p>
            <p className="mt-3 leading-relaxed text-carbon-400">
              Add a before/after pair above. Phone photos are fine — for this
              trade they read as more trustworthy than studio photography.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {projects.map((p) => (
              <article key={p.id} className="border-2 border-carbon-800">
                <header className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-carbon-800 px-5 py-3">
                  <span className="stamp text-carbon-500">
                    #{p.id} · {p.slug}
                  </span>
                  <span className="flex items-center gap-3">
                    <span
                      className={`stamp px-2 py-1 ${
                        p.published
                          ? "bg-hivis-400 text-carbon-950"
                          : "border border-carbon-700 text-carbon-500"
                      }`}
                    >
                      {p.published ? "Published" : "Draft"}
                    </span>
                    <DeleteProject id={p.id} />
                  </span>
                </header>

                <div className="grid grid-cols-2 gap-px bg-carbon-800">
                  {[
                    ["Before", p.before_public_id, p.before_alt],
                    ["After", p.after_public_id, p.after_alt],
                  ].map(([tag, id, alt]) => (
                    <figure key={tag} className="relative bg-carbon-950">
                      <Image
                        src={cloudinaryUrl(id as string, { width: 500 })}
                        alt={(alt as string) || ""}
                        width={500}
                        height={375}
                        className="aspect-[4/3] w-full object-cover"
                      />
                      <figcaption className="stamp absolute left-2 top-2 bg-carbon-950/90 px-2 py-1 text-paper-100">
                        {tag}
                      </figcaption>
                    </figure>
                  ))}
                </div>

                <details className="border-t-2 border-carbon-800">
                  <summary className="cursor-pointer px-5 py-4 font-display text-xl uppercase tracking-tight text-paper-50 hover:text-hivis-400">
                    {p.title}
                  </summary>
                  <div className="px-5 pb-5">
                    <ProjectForm
                      project={p}
                      services={serviceNames}
                      cities={cityNames}
                    />
                  </div>
                </details>
              </article>
            ))}
          </div>
        )}
      </section>
    </AdminShell>
  );
}
