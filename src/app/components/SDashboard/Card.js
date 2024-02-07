import React from "react";

function Card() {
  return (
    <>
      <div className="mt-8 w-72 h-96 bg-blue-500/30 rounded-xl border-4 border-blue-700 flex flex-col py-8 px-6">
        <span className="flex items-center justify-between">
          <h1 className="text-white gilroy-light ">NFT-Name</h1>
          <h1 className="text-white gilroy-light ">0x000123456789</h1>
        </span>
        <img src="ruby.png" className="mt-4" />
        <div className="mt-6 flex items-center justify-center rounded-xl py-2 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800">
          <h1 className="text-white gilroy-light ">Granted</h1>
        </div>
      </div>
    </>
  );
}

export default Card;
