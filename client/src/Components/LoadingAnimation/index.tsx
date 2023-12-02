import React, { useEffect, useState } from 'react';
import './index.css';

interface ILoadingAnimation{
    progress: number,
    textInfo: string,
    closeLoading: () => void
}

const LoadingAnimation = ({ progress, textInfo, closeLoading }: ILoadingAnimation) => {
    const [flow, setFlow] = useState(false);
    useEffect(() => {
        document.body.style.overflow = flow ? "auto":"hidden";
    }, [flow]);

    const clickDone = () => {
        setFlow(true);
        setTimeout(() => {
            closeLoading();
        }, 100);
    }

    return (
    <>
        <div className='fixed w-full h-[100vh] bg-[#00000038] z-10'>
            <div className='flex justify-center ml-[-16%] mt-[3%]'>
                <div className="loadingCard p-5" style={{"position": 'relative' }}>
                    <div>
                        {
                           progress !== 100 ? 
                           <div className="numberProgress text-[14px]" style={{ 'position': 'absolute', left:'0%', top: '35%' }}>
                            {progress > 0 ? progress:'0'}%</div>
                           :
                           ''
                        }
                        <div>
                            <label className={progress !== 100 ? 'progressStart':'progressStop'}>
                                <div className="checkDiv" style={{ 'display': progress !== 100 ? 'none': 'block' }} >
                                    <div className="check-icon"></div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div style={{ "marginTop":'20px' }}>
                        {
                            progress !== 100 ? 
                            <p className="text-[14px] text-center">This may take for a while. Please wait.</p>
                            :
                            <p className="text-[13px] text-center">{textInfo}</p>
                        }
                        {
                            progress === 100 ? 
                            <div style={{"display": "flex", "justifyContent": "center"}} className='mt-3'>
                                <button className="w-[80%] px-[11px] py-[7px] rounded-[15px] text-[14px] bg-[#FFD700]" 
                                onClick={ clickDone }>Finish</button>
                            </div>
                            :
                            ''
                        }
                    </div>
                </div>
            </div>
        
        </div>
    </>
    );
}

export default LoadingAnimation;