import { takeEvery, call, put, all} from 'redux-saga/effects';
import axios from 'axios';

import { GET_DOCU, GET_DOCU_SUCC, GET_DOCU_ERR, GET_DOCU_YEAR, GET_DOCU_YEAR_SUCC, GET_DOCU_YEAR_ERR } from '../Actions';

//Inventory resources_________________________________________
function* docuFunc({ dataC, type }:any): any{
    const { course, search, year, skip, limit } = dataC;
    
    try{
        let obj = {
            method: 'GET',
            url: 'https://directory-admin-server1.vercel.app/get_resources',
            params: { course: course, search: search, year: year, skip: skip, limit: limit /* use this when your method is GET */},
            data: { /* use this when your method is POST */ },
            headers: {
                'Content-Type': 'application/json'
            },
        } as any;

    
        const response = yield call(axios, obj, { withCredentials: true });
        if(response.data.success){
            yield all([put({ res: response.data.data, countTopYear: response.data.countTopYear, 
                countOtherThesis: response.data.countOtherThesis, countAll: response.data.countAll, type: GET_DOCU_SUCC })])
        }else{
            yield put({ res: 'error', type: GET_DOCU_ERR }); 
        }
    }catch(error){
        yield put({ res: 'error', type: GET_DOCU_ERR });
    }
}

//YearTop resources________________________________________________
function* yearTopFunc(): any{
    try{
        let obj = {
            method: 'GET',
            url: 'https://directory-admin-server1.vercel.app/getYearTop_thesis',
            params: { /* use this when your method is GET */},
            data: { /* use this when your method is POST */ },
            headers: {
                'Content-Type': 'application/json'
            },
        } as any;

    
        const response = yield call(axios, obj, { withCredentials: true });
        if(response.data.response){
            yield put({ top3: response.data.top3, othersTop: response.data.othersTop, type: GET_DOCU_YEAR_SUCC })
        }else{
            yield put({ res: 'error', type: GET_DOCU_YEAR_ERR }); 
        }
    }catch(error){
        console.log(error);
        yield put({ res: 'error', type: GET_DOCU_YEAR_ERR });
    }
}



export function* saga1(){
    yield takeEvery(GET_DOCU, docuFunc);
    yield takeEvery(GET_DOCU_YEAR, yearTopFunc);
}