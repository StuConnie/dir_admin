import React, {useEffect, useState, useRef, FormEvent} from 'react';
import BreadCrumbs from '../../Components/Breadcrumbs';
import axios from 'axios';

const AdminAccount = () => {
    const passStrength = [['Worst', '#FF2323', 20], ['Bad', '#FF4A4A', 40], ['Weak', '#D75601', 60], ['Not Strong', '#FACA51', 80], ['Strong', '#3F8F00', 100]];
    const [numSetStrength, setNumSetStrength] = useState(0);
    const [acc, setAcc] = useState({username: '', password: ''});

    const currentPassRef = useRef<any>('');
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        const getAcc = async () => {
            try {
                const response = await axios.post("https://directory-admin-server1.vercel.app/getAccount");
                const { data } = response;
                setAcc({ username: data.username, password: data.password });
            } catch (error) {
                // Handle the error or display an error message
                console.error(error);
            }
        };

        getAcc();
    }, []);

    const newPassFunc = (e: any) => {
        setNewPassword(e.target.value.toString());

        let lengthD = e.target.value.toString().length > 7 ? 1 : 0;

        let arrStrength = [/[A-Z]/.test(e.target.value.toString()), /[a-z]/.test(e.target.value.toString()), /\d/.test(e.target.value.toString()),
            /[^a-zA-Z0-9]/.test(e.target.value.toString())]

        let countStrength = arrStrength.filter(a => a);
        setNumSetStrength(countStrength.length + lengthD === 5 ? 4 : countStrength.length + lengthD);
    }
    const btnChangePassword = async () => {
        const currentPass = currentPassRef.current.value.trim();

        if (currentPass.length === 0) {
            alert('Please fill up the current password input.');
            return;
        }

        if (numSetStrength !== 4) {
            alert('Password Strength must be Strong.');
            return;
        }

        if (currentPass !== acc.password) {
            alert('Current Password is not correct.');
            return;
        }

        if (newPassword === acc.password) {
            alert('New Password is the same as the Current Password.');
            return;
        }

        try {

            const { data } = await axios.post(
                'https://directory-admin-server1.vercel.app/updateAccount',
                { password: newPassword },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            currentPassRef.current.value = '';
            setNewPassword('');
            setNumSetStrength(0);
            setAcc({ username: data.username, password: data.password });

            alert('Password changed successfully.');
        } catch (e) {

        }
    };

    // User Registration/Update state
    const [username, setUsername] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [access, setAccess] = useState<string>("")
    const [track, setTrack] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")

    const [password, setPassword] = useState<string>("")

    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        async function getAccounts() {
            try {
                //
                const usersData = await axios.get("https://directory-admin-server1.vercel.app/api/users/data");
                // @ts-ignore
                setAccounts(usersData.data);
            } catch (error) {
                console.error("Error fetching accounts:", error);
            }
        }

        getAccounts();
    }, []);


    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const userAccount = {username, email, access, track, password};

        if (password !== confirmPassword) {
            console.log("Password mismatched");
            return;
        }

        try {
            await axios.post("https://directory-admin-server1.vercel.app/api/users/register", userAccount, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <>
            <BreadCrumbs pathBread={['Management', 'Account Setup']}/>

            <div className='p-11'>
                <p className='text-[26px] font-bold tracking-wide'>User Account <span
                    className='text-[#D75601]'>Settings</span></p>
                <p className='text-[14px] font-normal tracking-wider w-[80%] mt-2'>In this section you can register,
                    edit or change the settings of the user account. You can change the username, access, and password
                    of the user account. </p>


                { /*________User Account________*/}
                <form onSubmit={submitHandler} className='flex gap-5'>
                    <div className='mt-10 mb-10 w-[50%]'>
                        <div className='mt-5'>
                            <p className='text-[#3B2D2D] text-[23px] font-bold'>Register/Update Account</p>
                            <p className='font-semibold text-[14px] tracking-wide my-2'>Username:</p>
                            <input value={username} onChange={(e) => setUsername(e.target.value)} type='text'
                                   className='py-1 px-3 w-full border-2 border-[#755C5C] rounded-lg bg-[#F3F4F6] text-[#755C5C]'/>
                        </div>

                        <div className='mt-5'>
                            <p className='font-semibold text-[14px] tracking-wide my-2'>Email:</p>
                            <input value={email} onChange={(e) => setEmail(e.target.value)} type='email'
                                   className='py-1 px-3 w-full border-2 border-[#755C5C] rounded-lg bg-[#F3F4F6] text-[#755C5C]'/>
                        </div>

                        <div className='mt-5'>
                            <p className='font-semibold text-[14px] tracking-wide my-2'>Access:</p>
                            <select value={access} onChange={(e) => setAccess(e.target.value)}
                                    className='py-2 px-3 w-full border-2 border-[#755C5C] rounded-lg bg-[#F3F4F6] text-[#755C5C]'>
                                <option>Teacher</option>
                                <option>Student</option>
                            </select>
                        </div>

                        {access !== "Teacher" ?
                            (<div className='mt-5'>
                                <p className='font-semibold text-[14px] tracking-wide my-2'>Track:</p>
                                <select value={track} onChange={(e) => setTrack(e.target.value)}
                                        className='py-2 px-3 w-full border-2 border-[#755C5C] rounded-lg bg-[#F3F4F6] text-[#755C5C]'>
                                    <option>STEM</option>
                                    <option>ABM</option>
                                    <option>HUMSS</option>
                                    <option>GAS</option>
                                    <option>I.C.T</option>
                                    <option>Home Economics</option>
                                </select>
                            </div>) : ""
                        }


                        <div className='mt-3'>
                            <p className='font-semibold text-[14px] tracking-wide my-2'>Password:</p>
                            <input value={password} onChange={(e) => setPassword(e.target.value)} type='password'
                                   className='py-1 px-3 w-full border-2 border-[#755C5C] rounded-lg bg-[#F3F4F6] text-[#755C5C]'/>
                        </div>

                        <div className='mt-3'>
                            <p className='font-semibold text-[14px] tracking-wide my-2'>Confirm Password:</p>
                            <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                   type='password'
                                   className='py-1 px-3 w-full border-2 border-[#755C5C] rounded-lg bg-[#F3F4F6] text-[#755C5C]'/>
                        </div>

                        <button
                            type="submit"
                            className='text-center py-3 w-full bg-[#FFD700] rounded-[20px] mt-6 font-medium'>Register/Update
                        </button>
                    </div>
                    <div className='mt-10 mb-10 w-[50%]'>
                        <p className='text-[#3B2D2D] text-[23px] font-bold'>User Table</p>

                        <table>
                            <thead>
                            <tr className=''>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>EMAIL</th>
                                <th>ACCESS</th>
                                <th>TRACK</th>
                                <th>BUTTON</th>
                            </tr>
                            </thead>
                            <tbody>
                            {accounts.length > 0 && accounts.map((e: any) =>
                                <tr key={e._id} className=''>
                                    <td>{e._id}</td>
                                    <td>{e.username}</td>
                                    <td>{e.email}</td>
                                    <td>{e.access}</td>
                                    <td>{e.track}</td>
                                    <td>
                                        <button
                                            className='text-center  w-full bg-[#FFD700]  font-medium rounded-md'>Select
                                        </button>
                                    </td>
                                </tr>
                            )
                            }

                            </tbody>
                        </table>
                    </div>
                </form>
            </div>

            <div className='bg-[#9d9d9d] h-[6px]'></div>

            <div className='p-11'>
                <p className='text-[26px] font-bold tracking-wide'>Administrator <span
                    className='text-[#D75601]'>Settings</span></p>
                <p className='text-[14px] font-normal tracking-wider w-[80%] mt-2'>In this section you can edit or
                    change the settings of account of the admin. You can change the username and password of the admin
                    account. </p>


                { /*________Current Account________*/}
                <div className='mt-10 mb-10'>
                    <p className='text-[#3B2D2D] text-[23px] font-bold'>Current Account</p>
                    <div className='mt-5'>
                        <p className='font-semibold text-[14px] tracking-wide my-2'>Username:</p>
                        <input type='text' value={acc.username} disabled={true}
                               className='py-1 px-3 w-[300px] border-2 border-[#755C5C] rounded-lg bg-[#F3F4F6] text-[#755C5C]'/>
                    </div>

                    <div className='mt-3'>
                        <p className='font-semibold text-[14px] tracking-wide my-2'>Password:</p>
                        <input type='password' value={acc.password}
                               className='py-1 px-3 w-[300px] border-2 border-[#755C5C] rounded-lg bg-[#F3F4F6] text-[#755C5C]'/>
                    </div>
                </div>

                <div className='flex'>

                    { /*_______Change Password LEFT_________*/}
                    <div>
                        <p className='text-[23px] text-[#3B2D2D] font-bold'>Change Password</p>

                        <div className='mt-5'>
                            <p className='font-semibold text-[14px] tracking-wide my-2'>Current Password:</p>
                            <input ref={currentPassRef} type='password'
                                   className='py-1 px-3 w-[300px] border-2 border-[#755C5C] rounded-lg bg-[#F3F4F6] '/>
                        </div>

                        <div className='mt-3'>
                            <p className='font-semibold text-[14px] tracking-wide my-2'>New Password:</p>
                            <input type='password' value={newPassword} onChange={newPassFunc}
                                   className='py-1 px-3 w-[300px] border-2 border-[#755C5C] rounded-lg bg-[#F3F4F6] '/>
                        </div>

                        <button onClick={btnChangePassword}
                                className='text-center py-3 w-full bg-[#FFD700] rounded-[20px] mt-6 font-medium'>Change
                            Password
                        </button>
                    </div>

                    {/*_______Password Strength________*/}
                    <div className='ml-[5%]'>
                        <p className='text-[23px] font-bold'>Password <span className='text-[#D75601]'>Strength</span>
                        </p>
                        <p className='text-[14px] font-normal tracking-wider mt-2'>A strong password is: At least 8
                            characters long but more is better. A combination of uppercase letters, lowercase letters,
                            numbers, and symbols. Not a word that can be found in a dictionary or the name of a person,
                            character, product, or organization.</p>

                        <div className='mt-6'>
                            <p className='text-[18px] font-bold'>{passStrength[numSetStrength][0]}</p>

                            <div className='w-[100%] h-[17px] bg-[#E4E3DB] rounded-[20px] overflow-hidden mt-1'>
                                <div className={`h-full ease-in duration-150`} style={{
                                    width: passStrength[numSetStrength][2] + '%',
                                    background: passStrength[numSetStrength][1]
                                }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default AdminAccount;