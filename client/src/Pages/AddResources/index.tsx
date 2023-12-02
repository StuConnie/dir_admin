import React, { useState, useEffect, useRef } from "react";
import BreadCrumbs from "../../Components/Breadcrumbs";

import { Viewer, Worker, PdfJs } from '@react-pdf-viewer/core';
// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';

import checkingAuth from "../../Components/Authentication/auth";
import UploadFile from "./uploadFile";
import LoadingAnimation from "../../Components/LoadingAnimation";

const AddResources = () => {

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
    const [validFiles, setValidFiles] = useState<boolean>(false);

    //Loading useState________________________________________________________
    const [loading, setLoading] = useState<boolean>(false);
    const [objLoading, setObjLoading] = useState<any>({});

    const breadCrumbs = ['Management', 'Add Resources'];
    const courses: Array<string> = ['STEM', 'ABM', 'HUMSS', 'GAS', 'I.C.T', 'Home Economics'];

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
                setUploadCloud('');
                setValidFiles(false);
                alert('Please select a PDF file.');
            }
        }
    }

    //Upload document________________________________________________
    const uploadDocu = async () => {
        if(title.current.value.trim().length > 0){
            if(overview.current.value.trim().length > 0){
                if(member.current.value.trim().length > 0){
                    if(year.current.value !== 'Select a Year'){
                        if(course.current.value !== 'Select a Track'){
                            if(validFiles){
                                if(await checkingAuth() !== 'false'){
                                    
                                    setObjLoading({ progress: Math.floor(Math.random()*70), textInfo: "Waiting", })
                                    window.scrollTo(0, 0)
                                    setTimeout(async () => {
                                        let obj = {
                                            items: {
                                                file: uploadCloud,
                                                fileType: typeof uploadCloud,
                                                title: title.current.value,
                                                overview: overview.current.value,
                                                member: member.current.value,
                                                year: yearArray()[parseInt(year.current.value)][1],
                                                yearFilter: yearArray()[parseInt(year.current.value)][0],
                                                course: course.current.value,
                                                enableComment: enableComment,
                                                from: 'addResources'
                                            }
                                        }                                        
                                        setLoading(true);
    
                                        const waiting = await UploadFile(obj);
                                        if(waiting){
                                            setObjLoading({ progress: 100, textInfo: "Done uploading the document. Please see it on Inventory Resources page." }); 
                                            
                                            title.current.value = "";
                                            overview.current.value = "";
                                            member.current.value = "";
                                            year.current.value = "Select a Year";
                                            course.current.value = "Select a Track"
                                            setFile(URL.createObjectURL(new Blob()));
                                            setValidFiles(false);
                                        }else{
                                            setLoading(false);
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
                            alert('Please select a Track.');
                        }
                    }else{
                        alert('Please select a Year.');
                    }
                }else{
                    alert('Please input Members.');
                }
            } else {
                alert('Overview is empty.');
            }
        }else{
            alert('Title is empty.');
        }
    }

    return (
        <>
        <div>
            <BreadCrumbs pathBread={breadCrumbs} />
            
            {
                loading ? <LoadingAnimation progress={ objLoading.progress } textInfo={ objLoading.textInfo } closeLoading={ () => setLoading(false) } />:''
            }

            <div className='p-8'>
                <div className='rounded-md shadow-md p-7 bg-white'>
                    <p className='text-[26px] text-black font-bold'>Upload <span className='text-[#D75601]'>Resources</span> here</p>
                    <p className='w-[65%] text-[14px] mt-1'>In this section you can now add research documents any time you wanted. By hitting the submit button it will automatically add into Inventory resources.</p>
                
                    <div className="flex mt-9">
                        {/*__Left side___*/}
                        <div className="w-[50%] pr-8">
                            <p className="font-bold text-[16px] text[#291943] mb-2">Title:</p>
                            <textarea ref={ title } placeholder="Title of research" className="mb-1 w-full h-[50px] rounded-xl p-2 font-inter border-2 border-[#EAEAEA] bg-[#f9f9f9] outline-none"></textarea>
                            <p className="font-bold text-[16px] text[#291943] mb-2">Overview:</p>
                            <textarea ref={ overview } placeholder="Overview of research" className="mb-1 w-full h-[150px] rounded-xl p-2 font-inter border-2 border-[#EAEAEA] bg-[#f9f9f9] outline-none"></textarea>
                            <div className="pr-2">
                                    <p className="font-bold text-[16px] text[#291943] mb-2">Member:</p>
                                    <textarea ref={ member } placeholder="Enter your member names separated by comma or by new lines" className="mb-1 w-full h-[150px] rounded-xl p-2 font-inter border-2 border-[#EAEAEA] bg-[#f9f9f9] outline-none"></textarea>
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
                            <div className="grid grid-cols-1 mb-3">
                                <p className="font-bold text-[16px] text[#291943] mb-2">Track:</p>
                                <select ref={ course } className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 ">
                                    <option selected>Select a Track</option>
                                    { courses.map(a => <option value={a}>{a}</option>) }
                                </select>
                            </div>
                            <div className="grid grid-cols-1 mb-10">
                                <p className="font-bold text-[16px] text[#291943] mb-2">File document:</p>
                                <input onChange={ validFile } type="file" accept="application/pdf" multiple={false}
                                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 p-2.5" />
                            </div>
                            <div className="flex justify-center">
                                <button onClick={ uploadDocu }
                                className="w-[60%] mb-8 p-3 font-bold text-center bg-[#0072BC] text-white text-[15px] rounded-[20px]">
                                    Upload
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
            </div>
        </div>
        </>
    )
}

export default AddResources;