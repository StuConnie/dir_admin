import React, { useEffect, useState } from 'react';
import { useLocation, Outlet, useNavigate } from 'react-router-dom';
import checkingAuth from './auth';

const Auth: React.FC = () => {
    const navi = useNavigate();
    const location = useLocation();
    const [outlet, setOutlet] = useState<boolean>(false); 


    useEffect(() => {
        const url = location.pathname;
        async function authCall() {
            if (url.toLowerCase().split('/').includes('login')) {
                if (await checkingAuth() === 'false') {
                    setOutlet(true);
                } else {
                    navi('/home');
                }
            } else if (url.toLowerCase().split('/').includes('home')) {
                if (await checkingAuth() === 'false') {
                    navi('/login');
                } else {
                    setOutlet(true);
                }
            }
        }
        authCall();
    }, [location]);

    return (
        <>
           {
                outlet ? <Outlet />:'Loading...' 
           }
        </>
    )
}

export default Auth;