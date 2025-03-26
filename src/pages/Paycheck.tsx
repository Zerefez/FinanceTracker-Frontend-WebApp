import Inner from "../components/Inner";
import PDFUploadComponent from "../components/PDFUpload";

export default function Paycheck() {
  return (
    <section>
      <Inner>
        <div className="mx-8 px-4 md:px-6">
          <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:gap-20">
            <div className="w-full">
              <h1 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">
                Welcome to your <span className="text-accent"> finance tracker ! </span>
              </h1>
              <p className="mb-4 text-3xl font-normal md:text-4xl lg:text-5xl">
                Keep track of your finances with ease.
              </p>
              <p className="mb-4 text-3xl font-normal md:text-4xl lg:text-5xl">
                Here is your <span className="text-accent"> latest Paycheck </span> overview.
              </p>
            </div>
          </div>

          <div className="my-5 grid grid-cols-1 items-center gap-[100px] md:my-10 md:grid-cols-2 md:items-start md:gap-20">
            <div className="w-[50wh] rounded-lg border-2 border-gray-200 p-5">
              <h1 className="mb-4 text-2xl font-bold md:text-3xl lg:text-4xl">
                <span className="text-accent"> Latest generated paycheck </span>
              </h1>
              <PDFUploadComponent title="Latest Generated Paycheck" type="generated" />
            </div>
            <div className="w-[50wh] rounded-lg border-2 border-gray-200 p-5">
              <h1 className="mb-4 text-2xl font-bold md:text-3xl lg:text-4xl">
                <span className="text-accent"> Latest user upload paycheck </span>
              </h1>
              <PDFUploadComponent title="Latest User Upload Paycheck" type="uploaded" />
            </div>
          </div>
        </div>
      </Inner>
    </section>
  );
}
