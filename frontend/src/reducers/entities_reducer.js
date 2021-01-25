import { combineReducers } from 'redux';

import portfoliosReducer from './portfolios_reducer';
import plansReducer from './plans_reducer';

const entitiesReducer = combineReducers({
  portfolios: portfoliosReducer,
  plans: plansReducer,
})

export default entitiesReducer;