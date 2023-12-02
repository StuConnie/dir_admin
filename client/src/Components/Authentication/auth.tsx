
import axios from 'axios';

const checkingAuth: any = async () => {
    try{
        let obj = {
            method: 'POST',
            url: 'https://directory-admin-server1.vercel.app/checkingAuth',
            params: { /*this is for req.params */ },
            data: { /*this is for req.body */ },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('_SdTok')}`
            },
        } as any;
    
        const res = await axios(obj);
        
        return res.data.success;
    }catch(error){
        return "false";
    }
}

export default checkingAuth;