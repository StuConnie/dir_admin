import React, { useEffect, useState } from 'react';
import { addR, invenR, topR, admin, logocircle, adminUser } from '../../utilities/PNG';
import { Outlet, useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
    const navi = useNavigate();
    const [naviState, setNaviState] = useState<boolean>(false);
    const [clickAcc, setClickAcc] = useState<boolean>(false);

    useEffect(() => {
        if(!naviState){
            /*'/home/addResource'*/
            navi('/home/addResource');
        }
    }, [navi])

    const clickNavi = (path: string) => {
        setNaviState(true);
        navi(path);

        setTimeout(() => {
            setNaviState(false);
        }, 50)
    }

    const logOut = () => {
        localStorage.removeItem('_SdTok');
        window.location.reload();
    }

    return (
        <>
        <div className='flex' onClick={() => setClickAcc(false) }>
            <div className='w-[350px] min-h-[100vh] bg-[#181716] p-5 text-white'>
                <div className='flex items-center mb-9'>
                    <img src={logocircle} className='w-[45px] h-[45px]' alt='logo' />
                    <p className='text-[17px] text-[#DEAC00] font-bold ml-[11px]'>THESISARY</p>
                </div>

                {/*__Navigation__*/}
                <div>
                    <p className='text-[16px] text-[#DEAC00]'>Management</p>
                    <div className='flex items-center my-5 cursor-pointer' onClick={ () => clickNavi('addResource') }>
                        <img src={addR} className='w-[27px] h-[27px]' alt='logo' />
                        <p className='text-[14px] text-white ml-[15px]'>Add Resources</p>
                    </div>
                    <div className='flex items-center my-5 cursor-pointer' onClick={ () => clickNavi('inventoryResources') }>
                        <img src={invenR} className='w-[27px] h-[27px]' alt='logo' />
                        <p className='text-[14px] text-white ml-[15px]'>Inventory Resources</p>
                    </div>
                    <div className='flex items-center my-5 cursor-pointer' onClick={ () => clickNavi('topyearResources') }>
                        <img src={topR} className='w-[27px] h-[27px]' alt='logo' />
                        <p className='text-[14px] text-white ml-[15px]'>Top-year Resources</p>
                    </div>
                    <div className='flex items-center my-5 cursor-pointer ' onClick={ () => clickNavi('adminAccount') }>
                        <img src={adminUser} className='w-[25px] h-[25px]' alt='logo' />
                        <p className='text-[14px] text-white ml-[15px]'>Account Setup</p>
                    </div>
                </div>
            </div>
            <div className='w-full min-h-full bg-[#F3F4F6]'>
                <div className='py-2 px-9 flex justify-between bg-white mb-[2px]'>
                    <div className='w-[50%]'></div>
                    <div className='relative' onClick={ (e) => e.stopPropagation() }>
                        <div onClick={ () => setClickAcc(a => !a) } className='cursor-pointer select-none'>
                            <div className='flex items-center'>
                                <p className='text-[15px] text-[#DEAC00] mr-[5px]'>Administrator</p>
                                <img src={admin} alt="admin" className='w-[41px] h-[41px]' />
                            </div>
                        </div>

                        {
                            clickAcc ?
                            <div onClick={ logOut }  className='absolute rounded-md shadow-lg w-full cursor-pointer select-none text-white bg-[#D85900] text-center p-2 mt-1 text-[14px]'>
                                Log out
                            </div>
                            :
                            ''
                        }
                        
                    </div>
                </div>
                
                <Outlet context={{ clickNavi }} />
            </div>
        </div>
        </>
    )
}

export default Home;