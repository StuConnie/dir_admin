import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';


const App: React.FC = () => {
    const navi = useNavigate();

    useEffect(() => {
        navi('/login');
    }, []);

    return (
        <>    
        <Outlet />
        </>
    );
}

export default App;