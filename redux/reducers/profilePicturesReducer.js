import { ADD_PICTURE, CLEAR_CACHE } from '../../constants/ReduxConstants';

const initialState = {
    cache: {}
};

const pictureCacheReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_PICTURE:
            return {
                ...state,
                cache: {
                    ...state.cache,
                    [action.user]: action.picture
                }
            };
        case CLEAR_CACHE:
            state = initialState
            return state;
        default:
            return state;
    }
};

export default pictureCacheReducer;