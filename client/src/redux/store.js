import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducers'

// This middleware will just add the property "async dispatch" to all actions
const asyncDispatchMiddleware = store => next => action => {
   let syncActivityFinished = false;
   let actionQueue = [];
 
   function flushQueue() {
     actionQueue.forEach(a => store.dispatch(a)); // flush queue
     actionQueue = [];
   }
 
   function asyncDispatch(asyncAction) {
     actionQueue = actionQueue.concat([asyncAction]);
 
     if (syncActivityFinished) {
       flushQueue();
     }
   }
 
   const actionWithAsyncDispatch =
     Object.assign({}, action, { asyncDispatch });
 
   const res = next(actionWithAsyncDispatch);
 
   syncActivityFinished = true;
   flushQueue();
 
   return res;
 };
const composeEnhancers = composeWithDevTools({ 
	trace: true, 
	traceLimit: 25 
}); 
const store = createStore(rootReducer, composeEnhancers(
  applyMiddleware(thunkMiddleware, asyncDispatchMiddleware)
))



// const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware, asyncDispatchMiddleware))


// The store now has the ability to accept thunk functions in `dispatch`
// const store = createStore(rootReducer, composedEnhancer)
export default store