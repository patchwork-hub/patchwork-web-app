import { State, Action } from '../types';

export const initialState: State = {
    showPollForm: false,
    showLanguageModal: false,
    charCount: 0,
};

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'TOGGLE_POLL_FORM':
            return { ...state, showPollForm: action.payload };
        case 'TOGGLE_LANGUAGE_MODAL':
            return { ...state, showLanguageModal: action.payload };
        case 'SET_CHAR_COUNT':
            return { ...state, charCount: action.payload };
        case 'RESET_FORM':
            return initialState;
        default:
            return state;
    }
};
