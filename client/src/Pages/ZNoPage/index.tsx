import React from 'react';
import { notFound } from '../../utilities/PNG';

const NotFound: React.FC = () => {
    return (
        <>
            <div className='lg:pt-[140px] pt-[100px] pb-[70px]'>
                <div className='mx-auto px-5 max-w-[1250px] lg:flex items-center'>
                    <div className='lg:hidden block'>
                        <div className='flex justify-center'>
                            <img src={ notFound } alt="404" className='w-full max-h-[500px] px-10'/>
                        </div>
                    </div>
                    <div className='lg:w-[50%] w-[100%]'>
                        <p className='lg:hidden block text-[35px] font-bold leading-[50px] text-center'>Oops, <span className='text-[#D75601]'>nothing</span> here...</p>
                        <p className='lg:block hidden text-[55px] font-bold leading-[68px]'>Oops, <br/><span className='text-[#D75601]'>nothing</span> here...</p>

                        <div className='flex lg:justify-start justify-center'>
                            <p className='lg:w-[80%] w-[95%] lg:text-left text-center  text-[15px] text-[#2B2929] mt-3'>Uh oh, we can’t seem to find the page you’re looking for. Try going back to previous page.</p>
                        </div>
                        
                        <div className='flex lg:justify-start justify-center'>
                            <button onClick={ () => window.history.back() }
                            className='lg:w-[28%] w-[50%] shadow-lg bg-[#D75601] text-white text-[15px] px-[20px] py-[10px] rounded-[25px] mt-8'>Go Back</button>
                        </div>
                    </div>
                    <div className='w-[50%] lg:block hidden'>
                        <img src={ notFound } alt="404" className='w-full h-full'/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NotFound;

