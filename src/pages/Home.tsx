import SUSection from "../components/SU";
import AnimatedText from "../components/ui/animation/animatedText";
import { useLocalization } from "../lib/hooks";
import JobOverviewPage from "./JobOverviewPage";

export default function Home() {
  const { t } = useLocalization();

  return (
    <section>
      <div className="h-full md:px-6">
        <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:gap-20">
          <div className="w-full">
            <AnimatedText
              phrases={[t('home.welcome')]}
              accentWords={["finance", "tracker"]}
              className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl"
              accentClassName="text-accent"
            />
            <AnimatedText
              phrases={[t('home.subtitle1'), t('home.subtitle2')]}
              accentWords={["economy"]}
              className="mb-4 text-2xl md:text-3xl lg:text-4xl"
              accentClassName="text-accent"
            />
          </div>
        </div>
        <div className="my-5 grid grid-cols-1 items-center gap-[100px] md:my-10 md:grid-cols-2 md:items-start md:gap-20">
          <JobOverviewPage />
          <SUSection />
        </div>
      </div>
    </section>
  );
}
