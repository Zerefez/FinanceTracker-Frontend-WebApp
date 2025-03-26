
export default function Home() {
  return (
    <section className="py-5">
      <div className=" mx-8 px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-20">
          <div className="w-full ">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Welcome to your <span className="text-accent"> finance tracker ! </span>
            </h1>
            <p className="text-3xl md:text-4xl lg:text-5xl font-normal mb-4">
              Keep track of your finances with ease.
            </p>
            <p className="text-3xl md:text-4xl lg:text-5xl font-normal mb-4">
              Here is your <span className="text-accent"> latest Paycheck </span> overview.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

