import { LOGGED_IN, LOGGED_OUT, SAVE_MONTHLY_REPORT, SAVE_INFO, SAVE_BANK_INFO, CHANGE_INFO, CLEAR_BANK_INFO, FETCH_USER_INFO_SUCCESS, FETCH_USER_INFO_BEGIN, FETCH_USER_INFO_FAILURE, UPDATE_BETA_INVITES } from '../../constants/ReduxConstants';
import { fetchUserInfoFailure, fetchUserInfoBegin, fetchUserInfoSuccess, setLoadedInfo } from '../actions/userInfo';
import { APP_ID } from '@env';
import { AsyncStorage } from 'react-native';
import { GET_USER_INFO } from '../../constants/Endpoints';

const initialState = {
    isLoggedIn: false,
    accountId: 'dwollatest',
    sessionId: '',
    userInfo: {
        balance: null
    },
    loading: false,
    amountSent: 0.0,
    amountReceived: 0.0,
    report: null,
    error: null,
    betaInvites: null
};

const userInfoReducer = (state = initialState, action) => {
    switch(action.type) {
        case FETCH_USER_INFO_BEGIN:
            return {
                ...state,
                loading: true,
                error: null
            };
        case FETCH_USER_INFO_SUCCESS:
            return {
                ...state,
                loading: false,
                userInfo: action.payload.info
            }
        case FETCH_USER_INFO_FAILURE:
            console.log(action.payload.error);
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                userInfo: { balance: null }
            }
        case LOGGED_IN:
            return {
                ...state,
                isLoggedIn: true,
                accountId: action.accountId,
                sessionId: action.sessionId
            };
        case SAVE_BANK_INFO:
            return {
                ...state,
                userInfo: {
                    ...state.userInfo,
                    linkedBank: {
                        institution: action.details.institution,
                        type: action.details.type
                    }
                }
            };
        case CLEAR_BANK_INFO:
            return {
                ...state,
                userInfo: {
                    ...state.userInfo,
                    linkedBank: null
                }
            };
        case UPDATE_BETA_INVITES:
            return {
                ...state,
                betaInvites: action.list
            }
        case LOGGED_OUT:
            state = initialState;
            return state;
        case SAVE_MONTHLY_REPORT:
            return {
                ...state,
                amountSent: action.details.amountSent,
                amountReceived: action.details.amountReceived,
                report: action.details.report
            };
        case CHANGE_INFO:
            return {
                ...state,
                userInfo: action.details
            };
        case SAVE_INFO:
            return {
                ...state,
                isLoggedIn: state.isLoggedIn,
                accountId: state.accountId,
                sessionId: state.sessionId,
                userInfo: action.info
            };
        default:
            return state;
    }
}

/**
 * Fetches given user's user info and updates the storage with
 * the new data on success.
 * @param {string} accountId current user's accountId
 * @param {string} sessionId current user's sessionId
 * @param navigation current navigation stack
 */
export function fetchUserInfo(accountId, sessionId, navigation = null) {
    return async dispatch => {
        const AUTH_TOKEN = await AsyncStorage.getItem('browserid');
        dispatch(setLoadedInfo(false));
        dispatch(fetchUserInfoBegin());
        const headers = { 'Authorization': AUTH_TOKEN, 'Application-Identifier': APP_ID };
        fetch(`${GET_USER_INFO}/${accountId}/${sessionId}`, { headers })
            .then(async response => await handleSuccess(response, navigation))
            .catch(handleError);
    }
}

const handleSuccess = async (response, navigation) => {
    if (!response.ok) throw response;
    const data = await response.json();
    dispatch(fetchUserInfoSuccess(data));
    dispatch(setLoadedInfo(true));
    if (navigation) {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }],
        });
    }
    return data;
};

const handleError = error => {
    dispatch(setLoadedInfo(false));
    try {
        error.text().then(text => {
            try {
                const data = JSON.parse(text);
                dispatch(fetchUserInfoFailure(data));
            } catch (e) { dispatch(fetchUserInfoFailure(text)); }
        });
    } catch { 
        dispatch(fetchUserInfoFailure(error)); 
    }
};

export default userInfoReducer;