import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

const steps = ["received", "reviewing", "completed"] as const;

/** Demo state: first step done, second in progress, last pending */
const STEP_STATE: Record<(typeof steps)[number], "done" | "current" | "upcoming"> = {
  received: "done",
  reviewing: "current",
  completed: "upcoming",
};

export default async function MyPage({ params }: Props) {
  const p = await params;
  setRequestLocale(p.locale);
  const t = await getTranslations("MyPage");
  const tt = await getTranslations("MyPage.timeline");

  return (
    <main className="flex flex-col gap-8" suppressHydrationWarning>
      <div>
        <h1 className="text-2xl font-semibold text-white">{t("title")}</h1>
        <p className="mt-2 text-base text-white/65">{t("subtitle")}</p>
        <p className="mt-1 text-sm text-white/45">{t("timelineHint")}</p>
      </div>

      <div className="relative overflow-hidden rounded-[1.35rem] border border-white/[0.08] bg-gradient-to-br from-navy-800/90 to-navy-900/95 p-6 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]">
        <div
          className="absolute left-[2.125rem] top-10 bottom-10 w-px bg-gradient-to-b from-boss-accent via-boss-accent/35 to-white/[0.08]"
          aria-hidden
        />

        <ol className="relative flex flex-col gap-0">
          {steps.map((key, index) => {
            const state = STEP_STATE[key];
            const isLast = index === steps.length - 1;

            return (
              <li key={key} className={`relative flex gap-5 pl-1 ${isLast ? "" : "pb-10"}`}>
                <div className="relative z-10 flex shrink-0 flex-col items-center">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl border-2 text-sm font-bold ${
                      state === "done"
                        ? "border-boss-accent bg-boss-accent text-navy-950 shadow-[0_0_20px_rgba(199,179,119,0.35)]"
                        : state === "current"
                          ? "border-boss-accent/80 bg-boss-accent-soft text-boss-accent shadow-[0_0_24px_rgba(199,179,119,0.25)]"
                          : "border-white/15 bg-navy-950/80 text-white/35"
                    }`}
                  >
                    {state === "done" ? "✓" : index + 1}
                  </span>
                </div>

                <div
                  className={`min-w-0 flex-1 rounded-2xl border px-4 py-4 ${
                    state === "current"
                      ? "border-boss-accent/40 bg-boss-accent-soft/25"
                      : "border-white/[0.06] bg-white/[0.03]"
                  }`}
                >
                  <p
                    className={`text-lg font-semibold leading-snug ${
                      state === "upcoming" ? "text-white/40" : "text-white"
                    }`}
                  >
                    {tt(key)}
                  </p>
                  {state === "current" && (
                    <p className="mt-2 inline-flex items-start gap-2 text-sm leading-relaxed text-boss-accent/90">
                      <span className="relative mt-1.5 flex h-2 w-2 shrink-0">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-boss-accent opacity-40" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-boss-accent" />
                      </span>
                      {t("statusInProgress")}
                    </p>
                  )}
                  {state === "upcoming" && <p className="mt-2 text-sm leading-relaxed text-white/40">{t("statusWaiting")}</p>}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </main>
  );
}
