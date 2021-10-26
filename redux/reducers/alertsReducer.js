import { ADD_ALERT, CLEAR_ALERTS, ADD_LOADER, CLEAR_LOADER } from '../../constants/ReduxConstants';

const initialState = {
    currentAlert: {
        visible: false
    },
    currentLoader: {
        visible: false
    }
};

const alertsReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_ALERT:
            return {
                ...state,
                currentAlert: action.alert
            };
        case CLEAR_ALERTS:
            return state = initialState;
        case ADD_LOADER:
            return {
                ...state,
                currentLoader: {
                    visible: true
                }
            }
        case CLEAR_LOADER:
            return {
                ...state,
                currentLoader: {
                    visible: false
                }
            }
        default:
            return state;
    }
};

export default alertsReducer;