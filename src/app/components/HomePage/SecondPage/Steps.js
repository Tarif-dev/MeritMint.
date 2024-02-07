import React from "react";

function Steps() {
  return (
    <>
      <section className=" w-screen h-auto">
        <h1 className="gilroy-bold text-slate-300 font-extrabold text-4xl ml-36 mb-8 mt-32">
          How it works
        </h1>
        <div className="flex">
          <div className="flex flex-col ml-40 items-center">
            <div className="absolute bg-[#0F172A] w-9 h-8 rounded-full border-4 border-blue-700"></div>
            <div className="h-full w-1 bg-gradient-to-b from-blue-700 via-blue-800 to-gray-900"></div>
          </div>
          <ul className="w-2/4 flex flex-col gap-16 mt-8 mb-16 mr-0">
            <li>
              <div className="w-full px-8 py-5 text-white rounded-2xl border-b-2 border-blue-700">
                <h2 className="gilroy-bold text-2xl ">
                  Step 1: Achieve & Earn
                </h2>
                <p className="mt-4 ml-4">
                  Students earn MeritMint tokens by excelling academically,
                  participating actively in extracurriculars, or contributing
                  positively to their community. Each milestone turns into a
                  rewarding opportunity
                </p>
              </div>
            </li>
            <li>
              <div className="w-full px-8 py-5 text-white rounded-2xl border-b-2 border-blue-800">
                <h2 className="gilroy-bold text-2xl ">Step 2: Track & Grow</h2>
                <p className="mt-4 ml-4">
                  Our intuitive dashboard allows students and educators to track
                  progress, set goals, and visualize achievements in real-time.
                  Watch your MeritMint balance grow as you reach new heights
                </p>
              </div>
            </li>
            <li>
              <div className="w-full px-8 py-5 text-white rounded-2xl border-b-2 border-blue-950">
                <h2 className="gilroy-bold text-2xl ">
                  Step 3: Redeem & Reinvest
                </h2>
                <p className="mt-4 ml-4">
                  MeritMint tokens aren't just symbolic. Redeem them for a range
                  of rewards, from educational resources to exclusive
                  experiences, or save them as an investment in your future.
                </p>
              </div>
            </li>
          </ul>
          <div className="w-2/5 h-auto ml-16 mr-40 pt-32">
            <img className="opacity-80" src="flow.png" alt="" />
          </div>
        </div>
      </section>
    </>
  );
}

export default Steps;
