import { GET_DOCU_SUCC, GET_DOCU_ERR, GET_DOCU_YEAR_SUCC, GET_DOCU_YEAR_ERR } from '../Actions';

//Inventory Resources_______________________________________________________________
export const Resourcesfunc = (state = { res: [], countTopYear: 0, countOtherThesis: 0, countAll: 0, type: 'loading' }, action: any) => {
    switch(action.type){
        case GET_DOCU_SUCC:
            return { ...state, res: action.res, countTopYear: action.countTopYear, countOtherThesis: action.countTopYear,
                countAll: action.countAll, type: 'done' }
        case GET_DOCU_ERR:
            return { ...state, res: state.res, countTopYear: state.countTopYear, countOtherThesis: state.countTopYear,
                countAll: state.countAll, type: 'done' }
        default:
            state = { res: state.res, countTopYear: state.countTopYear, countOtherThesis: state.countOtherThesis, 
                countAll: state.countAll, type: 'loading' }
            return state;
    }
}

//Year-top collect data_____________________________________________________________________
export const YearTopCollectfunc = (state = { top3: [], othersTop: [], type: 'loading' }, action: any) => {
    switch(action.type){
        case GET_DOCU_YEAR_SUCC:
            return { ...state, top3: action.top3, othersTop: action.othersTop, type: 'done' }
        case GET_DOCU_YEAR_ERR:
            return { ...state, top3: state.top3, othersTop: state.othersTop, type: 'done' }
        default:
            state = { top3: state.top3, othersTop: state.othersTop, type: 'loading' }
            return state;
    }
}