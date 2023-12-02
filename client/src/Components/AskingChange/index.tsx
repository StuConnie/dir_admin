import { useEffect, useState } from "react";

interface IAskingChange{
    title: string,
    textInfo: string,
    eventF: (condition: any) => void
}

const AskingChange = ({ title, textInfo, eventF }: IAskingChange) => {
    const [flow, setFlow] = useState(false);
    useEffect(() => {
        document.body.style.overflow = flow ? "auto":"hidden";
    }, [flow]);


    const eventClick = (str: any) => {
        if(str === 'NO'){
            setFlow(true);
            setTimeout(() => {
                eventF(str);
            }, 100);
            return;
        }
        eventF(str);
    }
    
    return (
        <>
            <div className='fixed justify-center w-full h-[100vh] bg-[#00000038] z-10'>
                <div className="flex justify-center ml-[-16%] mt-[3%]">
                    <div className="w-[350px] min-h-[150px] p-5 bg-white shadow-xl">
                        <div className="flex justify-between mb-5">
                            <p className="text-[#3B2129] text-[18px] ">{ title }</p>
                        </div>
                        <p className="text-[14px] mb-3">{ textInfo }</p>
                        <div>
                            <div className='float-right flex mt-1'>
                                <div className='text-[13px] py-1 px-4 font-bold text-black flex items-center 
                                hover:bg-[#FCE3EB] hover:text-[#EA345D] cursor-pointer' onClick={ () => eventClick('YES') }>YES</div>
                                <div className='text-[13px] py-1 px-4 font-bold text-black flex items-center 
                                hover:bg-[#FCE3EB] hover:text-[#EA345D] cursor-pointer' onClick={ () => eventClick('NO') }>NO</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AskingChange;