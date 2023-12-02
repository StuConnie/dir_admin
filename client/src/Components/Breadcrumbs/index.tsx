import React from "react";
import { home } from '../../utilities/PNG';
import { useNavigate } from "react-router-dom";

interface IBreadCrumbs{
    pathBread: Array<string>
}

const BreadCrumbs = ({ pathBread }: IBreadCrumbs) => {
    const navigate = useNavigate();

    return (
        <>
        <div className='shadow-md bg-white'>
            <div className='py-3 px-9 flex items-center shadow-2xl'>
                <img src={home} alt='home' className='w-[23px] h-[23px] cursor-pointer' onClick={ () => navigate('/home/addResource') } />
                {
                    pathBread.map(path => 
                    <div key={ Math.random() } className='flex items-center mt-1'>
                        <p className='text-[#9BA2AE] text-[20px] px-[18px]'>{'>'}</p>
                        <p className='text-[#868789] text-[15px]'>{path}</p>
                    </div>
                    )
                }
            </div>
        </div>
        </>
    )
}

export default BreadCrumbs;