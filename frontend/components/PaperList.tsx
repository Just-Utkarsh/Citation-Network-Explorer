import { Paper } from "@/types";

type Props = {
  papers: Paper[];
  influentialIds: string[];
};

export function PaperList({ papers, influentialIds }: Props) {
  const influentialSet = new Set(influentialIds);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-colors duration-300 dark:border-white dark:bg-[#1b1c1c]">
      <h2 className="mb-3 text-lg font-semibold">Papers</h2>
      <div className="space-y-3">
        {papers.map((paper) => (
          <article
            key={paper.id}
            className="rounded-md border border-slate-100 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm dark:border-slate-800"
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              {paper.openalex_url ? (
                <a
                  href={paper.openalex_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-slate-900 underline-offset-2 transition-colors hover:text-slate-600 hover:underline dark:text-slate-100 dark:hover:text-slate-300"
                >
                  {paper.title}
                  <span className="text-xs" aria-hidden="true">
                    ↗
                  </span>
                </a>
              ) : (
                <h3 className="text-sm font-medium">{paper.title}</h3>
              )}
              {influentialSet.has(paper.id) ? (
                <span className="rounded bg-amber-100 px-2 py-1 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  Influential
                </span>
              ) : null}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {paper.year ?? "N/A"} | Citations: {paper.cited_by_count} | Source: {paper.source ?? "Unknown"}
            </p>
            <p className="mt-2 line-clamp-3 text-sm text-slate-700 dark:text-slate-200">
              {paper.abstract || "No abstract available."}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
