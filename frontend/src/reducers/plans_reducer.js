import { RECEIVE_PLAN, UNSELECT_PLAN, CLEAR_PLANS } from '../actions/plan_actions';

const plansReducer = (state = [], action) => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_PLAN: 
      return Object.assign([], state, action.plan);
    case UNSELECT_PLAN:
      return state.filter(plans => plans === action.plan);
    case CLEAR_PLANS:
      return [];
    default:
      return state;
  }

}

export default plansReducer;