import React, { useRef, useState } from 'react';
import axios from 'axios';
import './index.css';


const Login: React.FC = () => {
    const [logErr, setlogErr] = useState(['', '']);
    const usernameRef = useRef<any>('');
    const passRef = useRef<any>('');


    const objData = (method: string, url: string, params: any, data: any) => {
        return {
            method: method,
            url: 'https://directory-admin-server1.vercel.app/'+url,
            params: params /*this is for req.params */ ,
            data: data,
            headers: {
                'Content-Type': 'application/json'
            },
        }
    }

    //Login_______________________________________________________
    const bttn = () => {
        setlogErr(['', '']);

        let str1 = '', str2 = '';

        if(usernameRef.current.value.trim().length > 0 && passRef.current.value.trim().length > 0){

            axios(objData('GET', 'loginAcc', { username: usernameRef.current.value, password: passRef.current.value }, {})).then((res: any) => {
                if(res.data.success){
                    axios(objData('POST', 'login', {}, { username: usernameRef.current.value, pass: passRef.current.value })).then((res: any) => {
                        if(res.data.success === 'true'){
                            localStorage.setItem('_SdTok', res.data.token);
                            window.location.reload();
                        }
                    })
                }else{
                    str1 = 'The username might be wrong.';
                    str2 = 'The password might be wrong.';
                    setlogErr([str1, str2]);
                }
            })

        }else{
            if(usernameRef.current.value.trim().length === 0){
                str1 = 'Input field is empty.';
            }

            if(passRef.current.value.trim().length === 0){
                str2 = 'Input field is empty.';
            }
            setlogErr([str1, str2]);
        }
    }


    //Hit enter in input______________________________________
    const inputSearch = (e: any) => {
        if(e.key === 'Enter'){
            bttn();
        }
    }    

    return (
        <>
        <div className='h-[100vh] flex justify-center items-center bg-[#D75601]'>
            <div className='w-[400px] min-h-[200px] bg-white rounded-md p-5'>
                <p className='text-center text-[#0063A8] text-[28px] font-bold mt-5'>Login Admin</p>
                <div className='mt-10 px-4'>
                    <input type='text' ref={usernameRef} onKeyDown={ inputSearch } placeholder='Username' className='bg-gray-50 border-2 outline-none border-gray-300  text-sm rounded-lg block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400 ' />
                    {
                        logErr[0].length > 0 ? <label className='text-[#ED2E2E] font-bold text-[13px]'>{logErr[0]}</label>:''
                    }

                    <input type='password' ref={passRef} onKeyDown={ inputSearch } placeholder='Password' className='mt-3 bg-gray-50 border-2 outline-none border-gray-300  text-sm rounded-lg block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400 ' />
                    {
                        logErr[1].length > 0 ? <label className='text-[#ED2E2E] font-bold text-[13px]'>{logErr[1]}</label>:''
                    }

                    <button onClick={bttn}
                    className='w-full my-8 p-3 font-bold text-center bg-[#FFD700] rounded-[20px]'>Log in</button>
                </div>
            </div>
        </div>
        </>
    )
}

export default Login;