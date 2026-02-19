import React from 'react'
import { Link } from 'react-router-dom'
import WhyThis from '../components/WhyThis';
import HowitWorks from '../components/HowitWorks';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Landingpage = () => {

    const theme = {
        bg: "#F9FAFB",
        surface: "#F0F2F5",
        card: "#E8EAED",
        border: "rgba(0,0,0,0.08)",
        accent: "#1a6b2a",
        accent2: "#c0174f",
        muted: "#888880",
        text: "#1a1a1e",
        dim: "#55554e",
    };

    return (

        <div>



            <div className='sticky top-0 z-50'>
                <Navbar />
            </div>


            <div className='min-h-screen max-w-7xl m-auto w-full py-15  font-main'>

                <div className="badge font-main flex justify-center items-center">
                    <h1 className='rounded-full border border-green-400 py-2 tracking-wider px-4'> POSH-Compliant Platform — India's Workplace Safety </h1>
                </div>

                <div className="main-text flex items-center justify-center py-5 ">
                    <h1 className='text-6xl font-semibold max-w-6xl tracking-wider text-center'> Report <span className='bg-clip-text text-transparent bg-linear-to-b from bg-green-200 via-green-400 to-green-800'>Harassment</span>  Without <span className='bg-linear-to-b from-green-100 to-green-200 py-2 px-4 text-5xl rotate-span'> Fear </span> </h1>
                </div>

                <div className="sub-text flex items-center justify-center py-10">
                    <p className='max-w-4xl font-normal tracking-wider text-center text-xl text-shadow-gray-500'> SafeDesk is a secure, encrypted platform that allows women to report workplace harassment completely anonymously — no identity exposure, no retaliation risk, full POSH compliance.</p>
                </div>


                <div className=' flex items-center justify-center gap-4'>
                    <div className='border relative border-gray-900 rounded-full py-2 px-3'>
                        <div className="absolute bottom-0 inset-x-0 bg-linear-to-r from-transparent via-green-400 to-transparent h-px ">
                        </div>
                        Anonymous Reporting
                    </div>

                    <div className='border relative border-gray-900 rounded-full py-2 px-3'>
                        <div className="absolute bottom-0 inset-x-0 bg-linear-to-r from-transparent via-green-400 to-transparent h-px ">
                        </div>
                        POSH Complient
                    </div>
                    <div className='border relative border-gray-900 rounded-full py-2 px-3'>
                        <div className="absolute bottom-0 inset-x-0 bg-linear-to-r from-transparent via-green-400 to-transparent h-px ">
                        </div>
                        Case Tracking
                    </div>
                </div>


                <div className="button flex items-center justify-center gap-4">
                    <Link to="/report" className='bg-green-500 text-white px-12 mt-12 py-2 rounded-full font-semibold shadow hover:bg-green-600 transition'> Report Now </Link>
                    <Link to={"/track"} className=' text-black px-12 mt-12 py-2 border-2 border-green-500 rounded-full font-semibold shadow hover:bg-green-600 transition'> Track Case </Link>
                </div>


                <div className="image-tagline py-10 flex items-center justify-around px-6">
                    <div className="image">
                        <img
                            src="/women01.png"
                            alt=""
                            className="h-90 
      [mask-image:linear-gradient(to_bottom,green_70%,transparent_100%)]
      [-webkit-mask-image:linear-gradient(to_bottom,green_70%,transparent_100%)]
    "
                        />
                    </div>



                    <div className='flex flex-col gap-8 justify-center'>
                        <h1 className='text-5xl font-semibold font-special tracking-widest'> Always Anonymous </h1>
                        <div>
                            <div className='font-main font-light border border-green-500 py-3 px-5 rounded-2xl'>
                                <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
                                    {["#ff5f57", "#ffbd2e", "#28c840"].map((c) => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
                                </div>

                                <div><span style={{ color: theme.accent }}>case_id</span> → <span style={{ color: theme.accent2 }}>"CASE-7X9K2M"</span></div>
                                <div><span style={{ color: theme.accent }}>identity</span> → <span style={{ color: theme.accent2 }}>null</span> <span style={{ color: "#aaa9a0" }}></span></div>
                                <div><span style={{ color: theme.accent }}>metadata</span> → <span style={{ color: theme.accent2 }}>null</span> <span style={{ color: "#aaa9a0" }}></span></div>
                                <div><span style={{ color: theme.accent }}>status</span> → <span style={{ color: theme.accent2 }}>"Under Review"</span></div>
                                <div><span style={{ color: theme.accent }}>encrypted</span> → <span style={{ color: theme.accent2 }}>true</span></div>
                                <div className='text-gray-950 font-extralight text-sm mt-2'> <span className='text-green-500 font-semibold'> - </span>  Your voice. Anonymous. Protected.</div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>

            <WhyThis />

            <HowitWorks />

            <Footer />

        </div>
    )
}

export default Landingpage