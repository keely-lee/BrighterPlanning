import { combineReducers } from 'redux';

import portfoliosReducer from './portfolios_reducer';

const entitiesReducer = combineReducers({
  portfolios: portfoliosReducer,
})

export default entitiesReducer;