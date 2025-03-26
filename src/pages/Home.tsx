
import Inner from "../components/Inner";
import AnimatedText from "../components/ui/animatedText";

export default function Home() {
  return (
    <section>
      <Inner>
        <div className="mx-8 px-4 md:px-6">
          <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:gap-20">
            <div className="w-full">
              <AnimatedText
                phrases={[
                  "Welcome to your finance tracker !",
                  "Keep track of your finances with ease.",
                  "Here is your economy overview.",
                ]}
                accentWords={["finance", "tracker", "economy"]}
                className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl"
                accentClassName="text-accent"
              />
            </div>
          </div>
          <div className="my-5 grid grid-cols-1 items-center gap-[100px] md:my-10 md:grid-cols-2 md:items-start md:gap-20">
            <div className="w-[50wh] rounded-lg border-2 border-gray-200 p-5">
              <AnimatedText
                phrases={["Your Jobs"]}
                accentWords={["Jobs"]} 
                className="mb-4 text-center text-2xl font-bold md:text-3xl lg:text-4xl"
                accentClassName="text-accent"
              />
            </div>
            <div className="w-[50wh] rounded-lg border-2 border-gray-200 p-5">
              <AnimatedText
                phrases={["Student Grant [SU]"]}
                accentWords={["[SU]"]}
                className="mb-4 text-center text-2xl font-bold md:text-3xl lg:text-4xl"
                accentClassName="text-accent"
              />
            </div>
          </div>
        </div>
      </Inner>
    </section>
  );
}
