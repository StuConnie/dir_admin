import React, { useEffect, useState } from 'react';
import BreadCrumbs from '../../Components/Breadcrumbs';
import { imgFrontPDF } from '../../utilities/PNG';
import checkingAuth from '../../Components/Authentication/auth';
import { useDispatch, useSelector } from 'react-redux';
import { GET_DOCU_YEAR } from '../../Redux/Actions';

// Import the main component
import { Viewer, Worker } from '@react-pdf-viewer/core'; // install this library
// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import DisableScrollPlugin from '../../Components/DisableScrollPDF';
import AskingChange from '../../Components/AskingChange';
import LoadingAnimation from '../../Components/LoadingAnimation';
import axios from 'axios';

import { useOutletContext } from 'react-router-dom';



const TopyearResources: React.FC = () => {
    const { clickNavi } = useOutletContext<any>();
    const dispatch = useDispatch();
    const selector = useSelector((a:any) => a.YearTopCollectfunc);

    const [confirmLoad, setConfirmLoad] = useState<string>('new');
    const [objconfirm, setObjConfirm] = useState<any>({});
    const [objLoading, setObjLoading] = useState<any>({});
    const breadCrumbs = ['Management', 'Top-year Resources'];

    useEffect(() => {
        getData();
    }, [])

    //GetData_______________________________________
    const getData = async () => {
        if(await checkingAuth() !== "false"){
            dispatch({ type: GET_DOCU_YEAR });
        }else{
            window.location.reload();
        }
    }

    //Remove from topYear thesis_________________________________________________________
    const removeBtn = (_id: any) => {
        window.scrollTo(0, 0)

        setObjConfirm({ title: 'Remove Document', textInfo: 'Are you sure you want to remove this document from TopYear page?', _id: _id });
        setTimeout(() => {
            setConfirmLoad('confirm');
        }, 500)
    }


    const eventRemove = async (condition: any) => {
        if(condition === 'YES'){
            setConfirmLoad('loading');
            setObjLoading({ progress: Math.floor(Math.random()*80), textInfo: 'Waiting'  });

            let obj = {
                method: 'POST',
                url: 'https://directory-admin-server1.vercel.app/RemoveYearTop',
                params: { /*this is for req.params */ },
                data: { _id: objconfirm._id },
                headers: {
                    'Content-Type': 'application/json'
                },
            } as any;

            try{
                const res = await axios(obj);
                if(res.data.response){
                    setObjLoading({ progress: 100, textInfo: 'Done removing document.'  });

                    getData();
                }else{
                    setConfirmLoad('new');
                    document.body.style.overflow = "auto";
                    alert('Opps.. Something is wrong please check your internet connection.')
                }
            }catch(err){
                setConfirmLoad('new');
                document.body.style.overflow = "auto";
                alert('Opps.. Something is wrong please check your internet connection.') 
            }
        
        }else{
            setConfirmLoad('new');
        }
    };


    return (
        <>
        <div>
            <BreadCrumbs pathBread={breadCrumbs} />
            {
                confirmLoad === 'confirm' ? 
                <AskingChange title={ objconfirm.title } textInfo={ objconfirm.textInfo } eventF={ eventRemove } />:''
            }
            {
                confirmLoad === 'loading' ? 
                <LoadingAnimation progress={ objLoading.progress } textInfo={ objLoading.textInfo } closeLoading={ () => setConfirmLoad('new') } />:''
            }


            <div className='p-8'>
                <div className='rounded-md shadow-md p-7 bg-white'>
                    <p className='text-[26px] text-black font-bold'>Top-year <span className='text-[#D75601]'>Resources</span></p>
                    <p className='w-[65%] text-[14px] mt-1'>In this section you can see the current Overall Top Three Research of the year and other selected research. You can also add a research as you will.</p>

                    <div className='flex mt-5'>
                        <button onClick={ () => clickNavi('/home/topyearResources/topThesis') }
                        className='px-[25px] py-[10px] text-[14px] text-white bg-[#DEAC00] rounded-lg mr-3'>+Top Research</button>
                        <button onClick={ () => clickNavi('/home/topyearResources/othersThesis') }
                        className='px-[25px] py-[10px] text-[14px] text-white bg-[#DEAC00] rounded-lg'>+Other Research</button>
                    </div>

                    {/*____Top 3 Thesis___*/}
                    <div className='mt-9'>
                        <p className='text-[24px] font-bold my-[5px]'>Overall Top Three Research</p>

                        {/*__Document Resourecs__*/}
                        <div className='bg-white rounded-lg grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1'>

                        { 
                        selector.type === 'done' ?
                        selector.top3.length > 0 ?  
                        selector.top3.map((a:any) => 
                        <div key={ Math.random() } className='p-1'>
                            <div className='min-h-[300px] bg-[#2A2A2C] p-2 flex rounded-md'>
                                <div className='w-[45%] rounded-l-md bg-white overflow-hidden relative' >
                                    { 
                                    //<img src={ imgFrontPDF } alt="frontPage" className='w-full h-full absolute z-20' />
                                    }
                                    <div className='h-[300px]'>
                                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.5.141/build/pdf.worker.min.js">
                                          <Viewer
                                              defaultScale={ 0.4 }
                                              fileUrl={ a.documentURI }
                                              plugins={[DisableScrollPlugin()]} 
                                          />
                                        </Worker>
                                    </div>
                                </div>
                                <div className='w-[55%] p-3 flex content-between flex-wrap'>
                                    <div className='m'>
                                        <p className='text-[#FFF200] text-[17px]'>{ a.course }</p>
                                        <p className='text-white text-[14px] mb-3'>{ a.year }</p>
                                        <p className='text-white text-[14px] mb-3'>Member: 0{ a.member }</p>

                                        <p className='text-white text-[15px] mb-3 line-clamp-4'>{ a.title }</p>
                                    </div>
                                    <div className='w-full'>
                                        <button onClick={ () => removeBtn(a._id) }
                                        className='w-full py-[6px] rounded-[11px] mt-2 bg-[#DC3545] text-white text-[13px] cursor-pointer'>Remove</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        )
                        :
                        <p>Empty</p>
                        :
                        <p>Loading...</p>
                        }

                        </div>
                    </div>

                    {/*____Other Research___*/}
                    <div className='mt-9'>
                        <p className='text-[24px] font-bold my-[5px]'>Other Research</p>

                        {/*__Document Resourecs__*/}
                        <div className='bg-white rounded-lg grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1'>


                        { 

                        selector.type === 'done' ?
                        selector.othersTop.length > 0 ?  
                        selector.othersTop.map((a:any) =>
                        <div key={ Math.random() } className='p-1'>
                            <div className='min-h-[300px] bg-[#2A2A2C] p-2 flex rounded-md'>
                                <div className='w-[45%] rounded-l-md bg-white overflow-hidden relative' >
                                    { 
                                    //<img src={ imgFrontPDF } alt="frontPage" className='w-full h-full absolute z-20' />
                                    }
                                    <div className='h-[300px]'>
                                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.5.141/build/pdf.worker.min.js">
                                          <Viewer
                                              defaultScale={ 0.4 }
                                              fileUrl={ a.documentURI }
                                              plugins={[DisableScrollPlugin()]} 
                                          />
                                        </Worker>
                                    </div>
                                </div>
                                <div className='w-[55%] p-3 flex content-between flex-wrap'>
                                    <div className='m'>
                                        <p className='text-[#FFF200] text-[17px]'>{ a.course }</p>
                                        <p className='text-white text-[14px] mb-3'>{ a.year }</p>
                                        <p className='text-white text-[14px] mb-3'>Member: 0{ a.member }</p>

                                        <p className='text-white text-[15px] mb-3 line-clamp-4'>{ a.title }</p>
                                    </div>
                                    <div className='w-full'>
                                        <button onClick={ () => removeBtn(a._id) }
                                        className='w-full py-[6px] rounded-[11px] mt-2 bg-[#DC3545] text-white text-[13px] cursor-pointer'>Remove</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        )
                        :
                        <p>Empty</p>
                        :
                        <p>Loading...</p>
                        }

                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default TopyearResources;