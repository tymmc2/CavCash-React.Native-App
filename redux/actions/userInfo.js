import * as Actions from '../../constants/ReduxConstants';

// Update user details after logging in
export const loggedIn = data => ({
    type: Actions.LOGGED_IN,
    accountId: data.accountId,
    sessionId: data.sessionId
});

// Clear login details after log out
export const loggedOut = () => ({
    type: Actions.LOGGED_OUT
});

// Save monthly report
export const saveReport = details => ({
    type: Actions.SAVE_MONTHLY_REPORT,
    details
});

// Save user info
export const saveInfo = info => ({
    type: Actions.SAVE_INFO,
    info
});

// Update user info
export const changeInfo = details => ({
    type: Actions.CHANGE_INFO,
    details
});

// Set user info
export const setLoadedInfo = loaded => ({
    type: Actions.SET_LOADED_INFO,
    loaded
})

// Update user's bank information
export const updateBankInfo = details => ({
    type: Actions.SAVE_BANK_INFO,
    details
});

// Clear user's bank information
export const clearBankInfo = () => ({
    type: Actions.CLEAR_BANK_INFO
});

// Fetch user info actions
export const fetchUserInfoBegin = () => ({
    type: Actions.FETCH_USER_INFO_BEGIN
});

export const fetchUserInfoSuccess = info => ({
    type: Actions.FETCH_USER_INFO_SUCCESS,
    payload: { info }
});

export const fetchUserInfoFailure = error => ({
    type: Actions.FETCH_USER_INFO_FAILURE,
    payload: { error }
});