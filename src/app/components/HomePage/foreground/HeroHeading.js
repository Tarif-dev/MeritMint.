import React from 'react'

function HeroHeading() {
  return (
    <>
    <div className="absolute top-1/3 left-[10%] w-1/3">
    <div>
        <h1 className='gilroy-bold text-slate-300 font-extrabold text-7xl'>Rewarding excellence</h1>
        <h1 className='text-slate-300 font-extrabold text-7xl'>in education</h1>
        <p className='gilroy-light text-slate-300 mt-4 text-wrap text-xl'>MeritMint: Where Achievements Meet Rewards</p>
    </div>
    <div className="flex gap-10 mt-8">
        <button type="button" class="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-bold rounded-lg text-xl px-5 py-2.5 text-center me-2 mb-2">Explore</button>
        
    </div>
    </div>
    </>
  )
}

export default HeroHeading