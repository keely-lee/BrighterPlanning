import { RECEIVE_PORTFOLIO } from '../actions/portfolio_action';

const portfoliosReducer = (state = {}, action) => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_PORTFOLIO: 
      return Object.assign({}, state, action.portfolio)
    default:
      return state;
  }

}

export default portfoliosReducer;