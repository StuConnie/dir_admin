import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Rating } from 'react-simple-star-rating';


import { Viewer, Worker, PdfJs } from '@react-pdf-viewer/core';
// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';


import LoadingAnimation from '../../../Components/LoadingAnimation';
import UploadFile from '../../AddResources/uploadFile';
import checkingAuth from '../../../Components/Authentication/auth';
import AskingChange from '../../../Components/AskingChange';
import BreadCrumbs from '../../../Components/Breadcrumbs';
import { empty } from '../../../utilities/PNG';



const ViewResources = () => {
    const { id } = useParams();

    //Input useRef______________________________________________________
    const title = useRef<any>('');
    const overview = useRef<any>('');
    const member = useRef<any>('');
    const year = useRef<any>('Select a year');
    const course = useRef<any>('Select a Track');  

    //File and enable comment useState____________________________________________
    const [enableComment, setEnableComment] = useState<string>('false');
    const [file, setFile] = useState<any>(URL.createObjectURL(new Blob()));
    const [uploadCloud, setUploadCloud] = useState<any>('');
    const [validFiles, setValidFiles] = useState<boolean>(true);

    //Get data state______________________________________________________________
    const [loadingGet, setLoadingGet] = useState('new');
    const [dataStore, setDataStore] = useState<any>([]);
    const [oldPublicId, setOldPublicId] = useState('');
    
    //Loading, confirm useState________________________________________________________
    const [confirmLoad, setConfirmLoad] = useState<string>('new');
    const [objconfirm, setObjConfirm] = useState<any>({});
    const [objLoading, setObjLoading] = useState<any>({});

    const breadCrumbs = ['Management', 'Inventory Resources', `${id}`];
    const courses: Array<string> = ['STEM', 'ABM', 'HUMSS', 'GAS', 'I.C.T', 'Home Economics'];
    

    //Rating_____________________________________________________________________
    const [showLess, setShowLess] = useState<boolean>(false);
    const [rateCalculated, setRateCalculated] = useState(0);
    const [getData, setGetData] = useState<any>({});


    //Toolbar_____________________________________________
    const toolbarPluginInstance = toolbarPlugin();
    const { renderDefaultToolbar, Toolbar } = toolbarPluginInstance;

    const transform = (slot:any) => ({
        ...slot,
        // These slots will be empty
        SwitchTheme: () => <></>,
        Open: () => <></>,
        Print: () => <></>,
        Download: () => <></>,
    });

    //Get the data______________________________________________________
    useEffect(() => {
        const loadGet = async () => {
            try {

                let obj = {
                    method: 'POST',
                    url: 'https://directory-admin-server1.vercel.app/getSelected',
                    params: { /*this is for req.params */ },
                    data: { _id: id },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                } as any;
        
                let res = await axios(obj);
                
                if(res.data.response){
                    let data = res.data.data[0];

                    setTimeout(() => {
                        title.current.value = data.title;
                        member.current.value = data.member;
                        year.current.value = yearArray().map((a,i) => a[1] === data.year ? i:-1).filter(a => a !== -1)[0];
                        course.current.value = data.course;
                    }, 500);

                    setOldPublicId(data.documentID);
                    setEnableComment(data.enableComment);
                    setFile(data.documentURI);
                    setDataStore([
                        data.title,
                        data.member,
                        data.year,
                        data.course,
                        data.enableComment,
                    ]);


                    //Calculate rate________________________________________
                    let arr = [data.star1, data.star2, data.star3, data.star4, data.star5]
                    let WeightedSum = arr.map((a, i) => (a*(i+1))).reduce((acc, curr) => acc+curr);

                    setRateCalculated(Number.isNaN(Number((WeightedSum/data.allRate).toFixed(2))) ? 0:Number((WeightedSum/data.allRate).toFixed(2)));
                    setGetData(data);

                }

                setLoadingGet(`${res.data.response}`);
            } catch (error) {
                setLoadingGet('false');
            }
        }

        loadGet();
    }, [])

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

    //Checking pdf file______________________________________________
    const validFile = (event: any) => {
        if(event.target.files.length > 0){
            const selectedFile = event.target.files[0];
            if (selectedFile.type === 'application/pdf') {
                setValidFiles(true);
                setUploadCloud(event.target.files[0]);
                setFile(URL.createObjectURL(event.target.files[0]));
            }else{
                setFile(URL.createObjectURL(new Blob()));
                setUploadCloud(false);
                setValidFiles(false);
                alert('Please select a PDF file.');
            }
        }
    }

    //Upload document________________________________________________
    const uploadDocu = async () => {

        let con = true;
        let years = year.current.value;
        let arr = [title.current.value, overview.current.value, member.current.value, 
        years !== 'Select a Year' ? yearArray()[parseInt(years)][1]:'Select a Year', 
        course.current.value, enableComment];
        for(let count = 0;count < dataStore.length;count++){
            if(arr[count] !== dataStore[count]){
                con = false;
            }
            if(count+1 === dataStore.length){
                if(typeof uploadCloud !== 'string') con = false;
                if(!con){
                    window.scrollTo(0, 0)

                    setObjConfirm({ title: 'Update Document', textInfo: 'Are you sure you want to update this document?' });
                    setTimeout(() => {
                        setConfirmLoad('confirm');
                    }, 500)
                }else{
                    alert('Nothing changed.');
                }
            }
        }

    }

    const eventUploadDocu = async (condition: any) => {
        let years = year.current.value;
        let arr = [title.current.value, overview.current.value, member.current.value, 
            years !== 'Select a Year' ? yearArray()[parseInt(years)][1]:'Select a Year', 
            course.current.value, enableComment];

        if(condition === 'YES'){
            if(arr[0].trim().length > 0){
                if(arr[1].trim().length > 0){
                    if(arr[2] !== 'Number of Member'){
                        if(years !== 'Select a Year'){
                            if(arr[4] !== 'Select a Track'){
                                if(validFiles){
                                    if(await checkingAuth() !== 'false'){
                                        setObjLoading({ progress: Math.floor(Math.random()*70), textInfo: "Waiting", })
                                        window.scrollTo(0, 0)
                                        setTimeout(async () => {
                                            let obj = {
                                                items: {
                                                    file: uploadCloud,
                                                    fileType: typeof uploadCloud,
                                                    title: arr[0],
                                                    overview: arr[1],
                                                    member: arr[2],
                                                    year: yearArray()[parseInt(year.current.value)][1],
                                                    yearFilter: yearArray()[parseInt(year.current.value)][0],
                                                    course: arr[4],
                                                    enableComment: enableComment,
                                                    _id: id,
                                                    oldPublicId: oldPublicId,
                                                    from: 'viewResources'
                                                }
                                            }
                                        
                                            setConfirmLoad('loading');
                                            const waiting = await UploadFile(obj);
                                            if(waiting){
                                                setUploadCloud('');
                                                setObjLoading({ progress: 100, textInfo: "Updated successfully" }); 
                                                setDataStore([
                                                    arr[0],
                                                    arr[1],
                                                    yearArray()[parseInt(year.current.value)][1],
                                                    arr[3],
                                                    enableComment
                                                ]);
                                            }else{
                                                setConfirmLoad('new');
                                                document.body.style.overflow = "auto";
                                            }
                                        }, 500);
                                    }else{
                                        window.location.reload();
                                    }
                                }else{
                                    alert('Please select a file or the file must be a PDF.');
                                }
                            }else{
                                alert('Please Select a Track.');
                            }
                        }else{
                            alert('Please select a Year.');
                        }
                    }else{
                        alert('Please select Number of Pax.');
                    }
                } else {
                    alert('Title is empty.');
                }
            }else{
                alert('Title is empty.');
            }
        }else{
            setConfirmLoad('new');
        }
    }

    return (
        <>
        <div>
            <BreadCrumbs pathBread={breadCrumbs} />
            
            {
                confirmLoad === 'confirm' ? 
                <AskingChange title={ objconfirm.title } textInfo={ objconfirm.textInfo } eventF={ eventUploadDocu } />:''
            }

            {
                confirmLoad === 'loading' ? 
                <LoadingAnimation progress={ objLoading.progress } textInfo={ objLoading.textInfo } closeLoading={ () => setConfirmLoad('new') } />:''
            }

            <div className='p-8'>

                <div className='rounded-md shadow-md p-7 bg-white mb-5'>
                    <div>
                        <p className='font-semibold text-[19px]'>Ratings of Viewer</p>
                        <div className='my-3'>
                            <div className='flex items-center mb-1'>
                                <span className='text-[28px] font-semibold'>{ rateCalculated }/5</span>
                                <div className='ml-2'>
                                    <Rating
                                        SVGstyle={ { 'display':'inline', 'marginTop': '-4px' } }
                                        size={22}
                                        readonly={ true }
                                        allowFraction={ true }
                                        initialValue={ rateCalculated === 5 ? 5: rateCalculated !==0 ? rateCalculated % 1 === 0 ? rateCalculated:rateCalculated-1: 0 }
                                        showTooltip={ false }
                                        tooltipStyle={{ 'fontSize': '13px' }}
                                    />
                                </div>
                            </div>
                            <p className='text-[15px] text-[#565454]'>{ getData.allRate } ratings</p>
                        </div>
                    </div>

                    <div>
                        <div className='flex justify-between'>
                            <p className='font-semibold text-[17px]'>Board Rating</p>
                            <p onClick={ () => setShowLess((a) => !a) } className='underline text-[#7664ec] cursor-pointer text-[15px] select-none'>
                                { showLess ? 'Show less': 'Show Rating' }
                            </p>
                        </div>
                    {
                        showLess ? 
                            [getData.star5, getData.star4, getData.star3, getData.star2, getData.star1].map((a, i) => 
                            <div key={ Math.random() } className='my-2 text-[14px] text-[#565454]'>
                                <div className='flex justify-between w-full mx-auto'>
                                    <p>{ Math.floor(5-i) } star</p>
                                    <p>{a === 0 && getData.allRate === 0 ? 0: Math.floor((a * 100) / getData.allRate)}%</p>
                                </div>
                        
                                <div className='h-[14px] overflow-hidden rounded-[20px] bg-[#E4E3DB] '>
                                    <div className={`h-[14px] rounded-[20px] bg-[#FACA51]`} style={{ width: (a === 0 && getData.allRate === 0 ? 0: Math.floor((a * 100) / getData.allRate))+'%' }}></div>
                                </div>
                            </div>
                            )
                        :
                        ''
                    }

                    </div>
                </div>

                <div className='rounded-md shadow-md p-7 bg-white'>
                    {
                        loadingGet === 'new' ? 'Loading....': 
                        loadingGet === 'true' ? 
                        <div>
                            <p className='text-[26px] text-black font-bold'>View <span className='text-[#D75601]'>Resources</span> here</p>
                            <p className='w-[65%] text-[14px] mt-1'>In this section you can now edit research documents any time you wanted, you can even see the comments of the students in this documents.</p>

                            <div className="flex mt-9">
                                {/*__Left side___*/}
                                <div className="w-[50%] pr-8">
                                    <p className="font-bold text-[16px] text[#291943] mb-2">Title:</p>
                                    <textarea ref={ title } placeholder="Title of research..." className="mb-3 w-full h-[150px] rounded-xl p-4 font-inter border-2 border-[#EAEAEA] bg-[#f9f9f9] outline-none"></textarea>
                                    <div className="grid grid-cols-2 mb-3">
                                        <div className="pr-2">
                                            <p className="font-bold text-[16px] text[#291943] mb-2">Member:</p>
                                            <select ref={ member } className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 ">
                                                <option selected>Number of Member</option>
                                                { '1,2,3,4,5,6,7,8,9'.split(',').map(a => <option value={a}>{a}</option>) }
                                            </select>
                                        </div>
                                        <div>
                                            <p className="font-bold text-[16px] text[#291943] mb-2">Year:</p>
                                            <select ref={ year } className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 ">
                                                <option selected>Select a Year</option>
                                                {
                                                    yearArray().map((a, i) => <option value={ i }>{ a[1] }</option>)
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 mb-3">
                                        <p className="font-bold text-[16px] text[#291943] mb-2">Course:</p>
                                        <select ref={ course } className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 ">
                                            <option selected>Select a Track</option>
                                            { courses.map(a => <option value={a}>{a}</option>) }
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-1 mb-8">
                                        <p className="font-bold text-[16px] text[#291943] mb-2">File document:</p>
                                        <input onChange={ validFile } type="file" accept="application/pdf" multiple={false}
                                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 p-2.5" />
                                    </div>
                                    <div className="flex justify-center">
                                        <button onClick={ uploadDocu }
                                        className="w-[60%] mb-8 p-3 font-bold text-center bg-[#28A745] text-white text-[15px] rounded-[20px]">
                                            Update
                                        </button>
                                    </div>
                                </div>
                                            
                                {/*___Ride side___*/}
                                <div className="w-[50%] h-[700px] mb-[50px]">
                                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.5.141/build/pdf.worker.min.js">
                                      <div style={{ background: '#EFEFEF' }}>
                                        <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>
                                      </div>
                                      <Viewer 
                                          enableSmoothScroll={true} 
                                          fileUrl={file}
                                          plugins={[toolbarPluginInstance]} 
                                      />
                                    </Worker>
                                </div>
                            </div>
                        </div>
                        :
                        <div className='flex justify-center py-10'>
                            <div>
                                <div className='flex justify-center'>
                                    <img src={ empty } alt="empty" className='max-w-[340px] max-h-[270px]' />
                                </div>
                                <p className='text-[26px] font-bold text-center mt-5 mb-2'>Can't <span className='text-[#D75601]'>Find</span> Document</p>
                                <div className='flex justify-center'>
                                    <p className='w-[80%] text-[14px] text-center'>If you see this maybe the document you looking for is no record in the database, or 
                                    you have internet problem.</p>
                                </div>
                            </div>
                        </div>  
                    }
                </div>
            </div>
        </div>
        </>
    )
}

export default ViewResources;