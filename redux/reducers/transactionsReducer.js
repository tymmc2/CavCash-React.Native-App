import { SAVE_TRANSACTIONS, CLEAR_TRANSACTIONS, FETCH_TRANSACTIONS_BEGIN, FETCH_TRANSACTIONS_FAILURE, FETCH_TRANSACTIONS_SUCCESS } from '../../constants/ReduxConstants';
import { fetchTransactionsBegin, fetchTransactionsSuccess } from '../actions/transactions';
import { handleError } from '..';
import { APP_ID } from '@env';
import { AsyncStorage } from 'react-native';
import { GET_TRANSACTIONS } from '../../constants/Endpoints';

const initialState = {
    transactionList: null,
    loading: false,
    loadedAllContent: false,
    error: null
};


const transactionsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SAVE_TRANSACTIONS:
            return {
                ...state,
                transactions: action.list,
                loading: false
            };
        case CLEAR_TRANSACTIONS:
            state = initialState;
            return state;
        case FETCH_TRANSACTIONS_BEGIN:
            return {
                ...state,
                loading: true,
                error: null
            };
        case FETCH_TRANSACTIONS_SUCCESS:
            const doneLoading = action.payload.transactions.length < 15;
            if (action.payload.lastId) {
                return {
                    ...state,
                    transactionList: state.transactionList.concat(action.payload.transactions),
                    loading: false,
                    loadedAllContent: doneLoading
                };
            } else {
                return {
                    ...state,
                    transactionList: action.payload.transactions,
                    loading: false,
                    loadedAllContent: doneLoading
                };
            }
        case FETCH_TRANSACTIONS_FAILURE:
            return {
                ...state,
                error: action.payload.error,
                transactionList: [],
                loading: false
            }
        default:
            return state;
    }
};

export function fetchTransactions(accountId, sessionId, amount, loading, lastId = null) {
    return async dispatch => {
        if (loading === false) {
            const AUTH_TOKEN = await AsyncStorage.getItem('browserid');
            dispatch(fetchTransactionsBegin());
            const headers = { 'Authorization': AUTH_TOKEN, 'Application-Identifier': APP_ID };
            return await fetch(`${GET_TRANSACTIONS}/${encodeURIComponent(accountId)}/${encodeURIComponent(sessionId)}/${amount}${lastId ? `/${lastId}` : ''}`, { headers })
                .then(async response => {
                    if (!response.ok) {
                        throw response;
                    }
                    const data = await response.json();
                    dispatch(fetchTransactionsSuccess(data, lastId));
                    return data;
                })
                .catch(error => {
                    console.log(error);
                    dispatch(handleError(error));
                });
        } else {
            console.log('null');
            return null;
        }
    }
}

export default transactionsReducer;