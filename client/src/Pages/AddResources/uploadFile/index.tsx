import axios from "axios"

interface IUploadFile{
    file: any,
    fileType: any,
    title: string,
    overview: string,
    member: string,
    year: string,
    yearFilter: string,
    course: string,
    enableComment: string
    _id?: string,
    oldPublicId?: string,
    from: string
}

type inter = {
    items: IUploadFile
}

const UploadFile = async ({ items }: inter) => {
    const formData = new FormData();
    if(items.fileType === 'object'){
        formData.append('file', items.file);
        formData.append('upload_preset', 'ml_default');
        formData.append('cloud_name', 'dutfzeatp');
    }

    try {
        var publicId, secureURI, obj;

        if(items.fileType === 'object'){
            //Upload file to cloudinary________________________________
            const response = await axios.post(
              `https://api.cloudinary.com/v1_1/dutfzeatp/upload`,
              formData
            );
            
            publicId = response.data.public_id;
            secureURI = response.data.secure_url
        }
        
        
        items.file = "";
        if(items.fileType === 'object' && items.from === 'addResources'){
            //Upload data to database____________________________________
            obj = {
                method: 'POST',
                url: 'https://directory-admin-server1.vercel.app/uploadResources',
                params: { /*this is for req.params */ },
                data: { IData: items, publicId: publicId, secureURI: secureURI },
                headers: {
                    'Content-Type': 'application/json'
                }
            } as any;
        }else{
            //Edit data to database by id___________________________________
            obj = {
                method: 'POST',
                url: 'https://directory-admin-server1.vercel.app/updateSelected',
                params: { /*this is for req.params */ },
                data: { IData: items, publicId: publicId, secureURI: secureURI, oldpublicId: items.oldPublicId },
                headers: {
                    'Content-Type': 'application/json'
                }
            } as any;
        }

        let waiting = await axios(obj);
        return waiting.data.response === 'success';
    } catch (error:any) {
        if(error.response.data.error.message.split(' ').includes('10485760.')){
            alert('The file size the system will accept is less than 15 MB.');
        }else{
            alert('Opps.. Something is wrong please check your internet connection.')
        }
        return false;
    }
}

export default UploadFile;