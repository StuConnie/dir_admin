import React, { useState, useEffect, useRef } from 'react';
import BreadCrumbs from '../../Components/Breadcrumbs';
import { search } from '../../utilities/PNG';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate, useOutletContext } from 'react-router-dom';

// Import the main component
import { Viewer, Worker } from '@react-pdf-viewer/core'; // install this library
// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';


import checkingAuth from '../../Components/Authentication/auth';
import { GET_DOCU } from '../../Redux/Actions';
import { empty, imgFrontPDF } from '../../utilities/PNG';
import AskingChange from '../../Components/AskingChange';
import LoadingAnimation from '../../Components/LoadingAnimation';
import DisableScrollPlugin from '../../Components/DisableScrollPDF';

function download_file(fileURL : string, fileName : string) {
  var link = document.createElement('a');
  link.href = fileURL;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const InventoryResources: React.FC = () => {
    
    const dispatch = useDispatch();
    const { clickNavi } = useOutletContext<any>();
    
    const dataDocuments = useSelector((a:any) => a.Resourcesfunc);
    
    const breadCrumbs = ['Management', 'Inventory Resources'];

    //useRef for year and search bar_____________________________________________
    const searchFilter = useRef<any>('');
    const yearFilter = useRef<any>('');
    const [searchs, setSearchs] = useState<any>('');

    //useState for course, skip and limit________________________________________________________
    const [selected, setSelected] = useState<string>('ALL');

    const [confirmLoad, setConfirmLoad] = useState<string>('new');
    const [objconfirm, setObjConfirm] = useState<any>({});
    const [objLoading, setObjLoading] = useState<any>({});
    const [yearSet, setYearSet] = useState(0);

    


    const courses: Array<string> = ['ALL', 'STEM', 'ABM', 'HUMSS', 'GAS', 'I.C.T', 'Home Economics'];

    useEffect(() => {
        buttonSearch();
    }, []);

    useEffect(() => {
        if(dataDocuments.res.length){
            var selectElement = document.querySelector("#option") as HTMLSelectElement;
            selectElement.selectedIndex = yearSet; 
        }
    }, [dataDocuments])

    //Get search, filter year, course, skip and limit______________________________________________________
    const filters = () => {
        let numb = yearFilter.current.value;     
        let years = numb !== 'By Year Posted' ? yearArray()[parseInt(numb)][0]:'';

        setYearSet(Number.isNaN(parseInt(numb)) ? 0:parseInt(numb)+1);

        return {
            course: selected, 
            search: searchFilter.current.value, 
            year: years, 
            skip: 0, 
            limit: 6
        };
    }

    //Click button search_______________________________________________________________
    const buttonSearch = async () => {
        if(await checkingAuth() !== "false"){
            dispatch({ dataC: filters(), type: GET_DOCU });

        }else{
            window.location.reload();
        }
    }

    //Year array_____________________________________________________
    const yearArray = () => {
        const startYear = 2022;
        const currentYear = new Date().getFullYear();
        
        let Array_year = [['2022','2022-2023']];

        for(let count = 1; count <= (currentYear-startYear);count++){
            let yearC = (2022+count);
            Array_year.push([`${yearC}`, `${yearC}-${yearC+1}`]);
        }

        return Array_year;
    }

    //Click btn Course________________________________________________
    const btnCourse = (course: string) => {
        setSelected(course);
        setArrowLeftRight([0, 24]);
        setRightLeArr(24);
        setIndexCount(4);

        dispatch({ dataC: {
            course: course, 
            search: searchFilter.current.value, 
            year: yearFilter.current.value !== 'By Year Posted' ? yearArray()[parseInt(yearFilter.current.value)][0]:'', 
            skip: 0, 
            limit: 6
        }, type: GET_DOCU });
    }

    //Delete btn_______________________________________________
    const deleteBtn = (_id: string) => {
        window.scrollTo(0, 0)

        setObjConfirm({ title: 'Delete Document', textInfo: 'Are you sure you want to delete this document?', _id: _id });
        setTimeout(() => {
            setConfirmLoad('confirm');
        }, 500)

    }

    //Delete document condition events__________________________________
    const eventDelete = async (condition: any) => {
        if(condition === 'YES'){
            setConfirmLoad('loading');
            setObjLoading({ progress: Math.floor(Math.random()*80), textInfo: 'Waiting'  });
            let obj = {
                method: 'POST',
                url: 'https://directory-admin-server1.vercel.app/delete_resources',
                params: { /*this is for req.params */ },
                data: { _id: objconfirm._id },
                headers: {
                    'Content-Type': 'application/json'
                },
            } as any;

            try{
                const res = await axios(obj);
                if(res.data.response){
                    setObjLoading({ progress: 100, textInfo: 'Done deleting document.'  });

                    setArrowLeftRight([0, 24]);
                    setRightLeArr(24);
                    setIndexCount(4);
                    buttonSearch();
                }else{
                    setConfirmLoad('new');
                    document.body.style.overflow = "auto";
                    alert('Opps.. Something is wrong please check your internet connection.')
                }
            }catch(e){
                setConfirmLoad('new');
                document.body.style.overflow = "auto";
                alert('Opps.. Something is wrong please check your internet connection.') 
            }
        }else{
            setConfirmLoad('new');
        }
    }


    //Fagination___________________________________________________________
    const [arrowLeftRight, setArrowLeftRight] = useState<Array<number>>([0, 24]);
    const [rightLeArr, setRightLeArr] = useState(24);
    const [indexCount, setIndexCount] = useState(4);

    /*useEffect(() => {
        console.log(arrowLeftRight);
        console.log(arrowLeftRight);
    }, [arrowLeftRight, indexCount])*/

    //Fagination count__________________________
    const faginationCount = (counts: any, minMaxCount: any) => {
        let arr = [];

        let cs = counts/6;
        let final = Number.isInteger(cs) ? cs:(cs+1);

        for(let count = 1;count <= Math.abs(indexCount-final-4);count++){
            if(count <= 4){
                let index = Math.floor((indexCount-4)+count);
                arr.push([0 /*this is limit (max) */, Math.floor(((count*6)+minMaxCount[0])-6) /*this is skip (min) */, index]);
            }
        }

        return arr;
    }

    //Fagination left and right arrow_______________________________________________
    const leftRightArrow = (condition: boolean, counts: any) => {

        if(condition){
            if(rightLeArr < counts) {
                setArrowLeftRight([arrowLeftRight[0]+24, arrowLeftRight[1]+24]);
                setRightLeArr(rightLeArr+24);
                setIndexCount(indexCount+4);
            }   
        }else{
            if(rightLeArr > 24){
                setArrowLeftRight([arrowLeftRight[0]-24, arrowLeftRight[1]-24]);
                setRightLeArr(rightLeArr-24);
                setIndexCount(indexCount-4);
            }
        }

    }

    //Fagination btn click number_______________________________________________________
    const clickFagi = (data: any) => {

        let numb = yearFilter.current.value;     
        let years = numb !== 'By Year Posted' ? yearArray()[parseInt(numb)][0]:'';

        setTimeout(() => {
            var selectElement = document.querySelector("#option") as HTMLSelectElement;
            selectElement.selectedIndex = Number.isNaN(parseInt(numb)) ? 0:parseInt(numb)+1; 
        }, 200)

        dispatch({ dataC: {
            course: selected, 
            search: searchFilter.current.value, 
            year: years, 
            skip: data[1], 
            limit: data[0]
        }, type: GET_DOCU });
    }

    
    //Hit enter in input______________________________________
    const inputSearch = (e: any) => {
        if(e.key === 'Enter' && searchFilter.current.value !== searchs){
            setSearchs(searchFilter.current.value);
            buttonSearch();
        }
    }



    return (
        <>
        <div>
            <BreadCrumbs pathBread={breadCrumbs} />
            {
                confirmLoad === 'confirm' ? 
                <AskingChange title={ objconfirm.title } textInfo={ objconfirm.textInfo } eventF={ eventDelete } />:''
            }
            {
                confirmLoad === 'loading' ? 
                <LoadingAnimation progress={ objLoading.progress } textInfo={ objLoading.textInfo } closeLoading={ () => setConfirmLoad('new') } />:''
            }


            
            <div className='p-7'>   

                {/*___Header search____*/}
                <div className='rounded-lg shadow-md p-9 bg-white mb-7'>
                    <div className='flex items-center mb-6'>
                        <div className='w-[330px] h-[40px] px-[15px] border-2 rounded-md border-[#D1D5DB] flex items-center bg-[#F9FAFB]'>
                            <img src={search} alt="search" className='w-[21px] h-[21px]' />
                            <input type="text" ref={ searchFilter } onKeyDown={ inputSearch } placeholder='Search a Word' className='w-[90%] outline-none ml-3 text-[15px] bg-[#F9FAFB]'  />
                        </div>
                        <div className='ml-5 flex items-center'>
                            <p className='text-[15px] text-[#868789] mr-2'>Filter By:</p>
                            <div>
                                <select ref={ yearFilter } id="option" className="w-[190px] h-[40px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5 ">
                                    <option selected>By Year Posted</option>
                                    {
                                        yearArray().map((a, i) => <option key={ Math.random() } value={ i }>{ a[1] }</option>)
                                    }
                                </select>
                            </div>
                        </div>
                        <div className='ml-6'>
                            <button onClick={ buttonSearch }
                            className="w-[120px] h-[40px] px-[20px] text-center text-white text-[14px] bg-[#DEAC00] rounded-[12px]">Search</button>
                        </div>
                    </div>

                    <div className='flex flex-wrap ml-[-11px]'>
                        {
                            courses.map(a => <div key={Math.random()} onClick={ () => btnCourse(a) }
                            className={'text-[15px] p-2 rounded-lg mx-3 cursor-pointer '+(selected === a ? 'bg-[#048BE2] text-white':'text-[#8C8681]')}>{a}</div>)
                        }
                    </div>
                </div>

                {/*__Query Result number__*/}
                <p className='mb-3 text-[19px] text-[#5C4646]'>
                    Query Result: { dataDocuments.countAll > 9 ? dataDocuments.countAll:dataDocuments.countAll !== 0 ? '0'+dataDocuments.countAll:'0' }
                </p>

                <div className='p-5 bg-white rounded-lg '>
                    {/*__Document Fagination__*/}
                    {
                        (dataDocuments.type === 'done' ? 
                        dataDocuments.res.length > 0 ? 
                        <div className='mb-5 mt-3 flex justify-between items-center'>
                            <div className='flex items-center'>
                                <div onClick={ () => leftRightArrow(false, dataDocuments.countAll) } 
                                className='px-3 py-1 rounded-md bg-[gold] cursor-pointer'>{'<'}</div>
                                {
                                    faginationCount(dataDocuments.countAll, arrowLeftRight).map((a:any) => 
                                    <div key={Math.random()} onClick={ () => clickFagi(a) }
                                    className='px-3 py-1 text-[14px] underline cursor-pointer'>{a[2]}</div>)
                                }
                                {
                                    rightLeArr < dataDocuments.countAll ? <p className='px-3'> ... </p>:''
                                }
                                <div onClick={ () => leftRightArrow(true, dataDocuments.countAll) } 
                                className='px-3 py-1 rounded-md bg-[gold] cursor-pointer'>{'>'}</div>
                            </div>
                            <div className='font-bold text-[15px]'>
                                { dataDocuments.res.length > 9 ? dataDocuments.countAll:'0'+dataDocuments.res.length }-06 of 
                                { dataDocuments.countAll > 9 ? ' '+dataDocuments.countAll:' 0'+dataDocuments.countAll }</div>
                        </div>
                        :
                        ''
                        :
                        '')
                    }

                    {/*__Document Resources__*/}
                    <div className={(dataDocuments.res.length > 0 ? 'grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1':'')}>

                        {  
                        dataDocuments.type === 'done' ?
                        dataDocuments.res.length > 0 ? dataDocuments.res.map((a:any) => 
                        <div key={ Math.random() } className='p-1 flex'>
                            <div className='min-h-[300px] bg-[#2A2A2C] p-2 flex flex-1 rounded-md'>
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
                                        <p className='text-[#FFF200] text-[17px] mb-3 line-clamp-4'>{ a.title }</p>
                                        <p className='text-white text-[14px] mb-1'>{ a.year }</p>
                                        <p className='text-white text-[14px] mb-1'>Member: 0{ a.member }</p>
                                        <p className='text-white text-[14px] mb-3'>{ a.course }</p>
                                        <p className='text-white text-[15px] mb-3 line-clamp-4'>{ a.overview }</p>
                                    </div>
                                    <div className='w-full'>
                                        <button onClick={() => window.open(a.documentURI, '_blank')}
                                        className='w-full py-[6px] rounded-[11px] mt-2 bg-[#1530de] text-white text-[13px] cursor-pointer'>Download Document</button>
                                        <button onClick={ () => clickNavi(`/home/inventoryResources/${a._id}`) }
                                        className='w-full py-[6px] rounded-[11px] mt-2 bg-[#28A745] text-white text-[13px] cursor-pointer'>Click to Edit</button>
                                        <button onClick={ () => deleteBtn(a._id) }
                                        className='w-full py-[6px] rounded-[11px] mt-2 bg-[#DC3545] text-white text-[13px] cursor-pointer'>Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        )
                        :
                        <div className='flex justify-center py-10'>
                            <div>
                                <div className='flex justify-center'>
                                    <img src={ empty } alt="empty" className='max-w-[340px] max-h-[270px]' />
                                </div>
                                <p className='text-[26px] font-bold text-center mt-5 mb-2'>Inventory is <span className='text-[#D75601]'>Empty</span></p>
                                <div className='flex justify-center'>
                                    <p className='w-[80%] text-[14px] text-center'>If you see this maybe the inventory is empty, or your query did not find any related documents, 
                                    or you have internet connection problem.</p>
                                </div>
                            </div>
                        </div>
                        :
                        <p>Loading...</p>
                        }


                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default InventoryResources;

