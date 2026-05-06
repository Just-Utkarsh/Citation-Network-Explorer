import { Recommendation } from "@/types";

type Props = {
  influentialIds: string[];
  recommendations: Recommendation[];
  insights: string[];
};

function LinkItem({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 underline-offset-2 transition-colors hover:text-slate-500 hover:underline dark:hover:text-slate-200"
    >
      {url}
      <span className="text-xs" aria-hidden="true">
        ↗
      </span>
    </a>
  );
}

export function InsightPanel({ influentialIds, recommendations, insights }: Props) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-colors duration-300 dark:border-white dark:bg-[#1b1c1c]">
      <h2 className="mb-3 text-lg font-semibold">Research Insights</h2>

      <div className="space-y-4 text-sm">
        <div>
          <h3 className="font-medium text-slate-900 dark:text-slate-100">Top influential papers</h3>
          <ul className="mt-1 list-inside list-disc text-slate-700 dark:text-slate-300">
            {influentialIds.map((id) => (
              <li key={id}>
                <LinkItem url={id} />
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-medium text-slate-900 dark:text-slate-100">Related paper recommendations</h3>
          <ul className="mt-1 list-inside list-disc text-slate-700 dark:text-slate-300">
            {recommendations.map((item) => (
              <li key={item.paper_id}>
                <LinkItem url={item.paper_id} /> (score: {item.score.toFixed(3)})
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-medium text-slate-900 dark:text-slate-100">Quick takeaways</h3>
          <ul className="mt-1 list-inside list-disc text-slate-700 dark:text-slate-300">
            {insights.map((insight) => (
              <li key={insight}>{insight}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
