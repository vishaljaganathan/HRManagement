import { createStore, applyMiddleware } from 'redux';
import  {thunk} from 'redux-thunk';
import rootReducer from './rootreducer'; // Adjust the path according to your project structure

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;