export const RECEIVE_PLAN = 'RECEIVE_PLAN';
export const UNSELECT_PLAN = 'UNSELECT_PLAN';
export const CLEAR_PLANS = 'CLEAR_PLANS';

export const receivePlan = plan => ({
  type: RECEIVE_PLAN,
  plan
})

export const unselectPlan = plan => ({
  type: UNSELECT_PLAN,
  plan
})

export const clearPlans = () => ({
  type: CLEAR_PLANS
})