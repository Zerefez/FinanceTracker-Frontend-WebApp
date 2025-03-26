import Inner from "../components/Inner";
import PDFUploadComponent from "../components/PDFUpload";
import AnimatedText from "../components/ui/animatedText";

export default function Paycheck() {
  return (
    <section>
      <Inner>
        <div className="mx-8 px-4 md:px-6">
          <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:gap-20">
            <div className="w-full">
              <AnimatedText
                phrases={["Welcome to your finance tracker !"]}
                accentWords={["finance", "tracker"]}
                className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl"
                accentClassName="text-accent"
              />
              <AnimatedText
                phrases={["Keep track of your finances with ease."]}
                className="mb-4 text-3xl font-normal md:text-4xl lg:text-5xl"
              />
              <AnimatedText
                phrases={["Here is your latest Paycheck overview."]}
                accentWords={["latest", "Paycheck"]}
                className="mb-4 text-3xl font-normal md:text-4xl lg:text-5xl"
                accentClassName="text-accent"
              />
            </div>
          </div>

          <div className="my-5 grid grid-cols-1 items-center gap-[100px] md:my-10 md:grid-cols-2 md:items-start md:gap-20">
            <div className="w-[50wh] rounded-lg border-2 border-gray-200 p-5">
              <AnimatedText
                phrases={["Latest generated paycheck"]}
                accentWords={["Latest generated paycheck"]}
                className="mb-4 text-2xl font-bold md:text-3xl lg:text-4xl"
                accentClassName="text-accent"
              />
              <PDFUploadComponent title="Latest Generated Paycheck" type="generated" />
            </div>
            <div className="w-[50wh] rounded-lg border-2 border-gray-200 p-5">
              <AnimatedText
                phrases={["Latest user upload paycheck"]}
                accentWords={["Latest user upload paycheck"]}
                className="mb-4 text-2xl font-bold md:text-3xl lg:text-4xl"
                accentClassName="text-accent"
              />
              <PDFUploadComponent title="Latest User Upload Paycheck" type="uploaded" />
            </div>
          </div>
        </div>
      </Inner>
    </section>
  );
}
