import React from 'react'

const WhyThis = () => {
    return (
        <div className=' max-w-7xl m-auto py-10 tracking-wider'>

            <div className='main flex justify-center items-center py-18'>
                <h1 className='text-center text-3xl font-bold font-starter '> Why This Platform ? </h1>
            </div>

            <div className="data flex items-center justify-center gap-12">

                <div className="card flex flex-col gap-1">
                    <div className="number font-number text-6xl font-bold tracking-wider bg-clip-text text-transparent bg-linear-to-b from-green-600 to-green-800"> 43% </div>
                    <div className="about max-w-2xl">
                        <p className='text-gray-600 font-light max-w-80 tracking-wider' > Indian women experience
                            harassment at work </p>
                    </div>
                </div>

                

                <div className="card flex flex-col gap-1">
                    <div className="number font-number text-6xl font-bold tracking-wider bg-clip-text text-transparent bg-linear-to-b from-green-600 to-green-800"> +67% </div>
                    <div className="about max-w-2xl">
                        <p className='text-gray-600 font-light max-w-80 tracking-wider' > Increase in unresolved POSH cases (2023-24) </p>
                    </div>
                </div>





                <div className="card flex flex-col gap-1">
                    <div className="number font-number text-6xl font-bold tracking-wider bg-clip-text text-transparent bg-linear-to-b from-green-600 to-green-800"> 51% </div>
                    <div className="about max-w-2xl">
                        <p className='text-gray-600 font-light max-w-80 tracking-wider' > Women aged 18-49 personally
experienced harassment </p>
                    </div>
                </div>



            </div>

        </div>
    )
}

export default WhyThis