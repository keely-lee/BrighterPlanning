import { RECEIVE_PLAN, RECEIVE_PLANS, UNSELECT_PLAN, CLEAR_PLANS } from '../actions/plan_actions';

const plansReducer = (state = [], action) => {
  Object.freeze(state);
  let newState;

  switch (action.type) {
    case RECEIVE_PLAN: 
      newState = [action.plan]
      return newState;
    // case RECEIVE_PLANS: 
    //   newState = Object.assign([], state);
    //   newState.push(action.plan)
    //   return newState;
    case UNSELECT_PLAN:
      return state.filter(plans => plans === action.plan);
    case CLEAR_PLANS:
      return [];
    default:
      return state;
  }

}

export default plansReducer;