import * as Actions from '../../constants/ReduxConstants';

const initState = {
    saveLogin: true,
    notifications: true
};

export const settingsReducer = (state = initState, action) => {
    switch (action.type) {
        case Actions.UPDATE_SETTING:
            return {
                ...state,
                [action.setting.name]: action.setting.value
            };
        default:
            return state;
    }
};