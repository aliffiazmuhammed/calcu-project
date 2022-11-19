import { useReducer } from 'react';
import Operation from './Operation';
import Digits from './Digits';
import './App.css';


export const ACTIONS ={
  ADD_DIGIT: "adddigit",
  CHOOSE_OPERATION:"operation",
  EVALUATE:"evaluate",
  CLEAR:"clear",
  DELETE:"delete"
}
const reducer = (state,{type,payload})=>{
  switch(type){
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentoperand: payload.digit,
          overwrite: false,
        }
      }
      if(payload.digit ==="0"&&state.currentoperand ==="0")return state
      if(payload.digit ==="."&&state.currentoperand.includes("."))return state
      return {
        ...state,
        currentoperand:`${ state.currentoperand||"" }${ payload.digit }`,
  }
  case ACTIONS.CHOOSE_OPERATION:
    if(state.previousoperand == null && state.currentoperand == null)return state
    if (state.currentoperand == null) {
      return {
        ...state,
        operation: payload.operation,
      }
    }
    if(state.previousoperand == null){
      return{
      ...state,
      previousoperand:state.currentoperand,
      operation:payload.operation,
      currentoperand:null
    }}
    return{
      ...state,
      previousoperand:evaluate(state),
      operation:payload.operation,
      currentoperand:null
    }
  case ACTIONS.CLEAR:
      return{}
  case ACTIONS.EVALUATE:
    if (
      state.operation == null ||
      // state.currentoperand == null ||
      state.previousoperand == null
    ) {
      return state
    }else if(state.currentoperand == null){
      return {currentoperand: state.previousoperand}
    }
      return{
        currentoperand:evaluate(state),
        overwrite: true
      }
  case ACTIONS.DELETE_DIGIT:
        if (state.currentoperand == null) return state
        if (state.currentoperand.length === 1) {
          return { ...state, currentoperand: null }
        }
        return {
          ...state,
          currentoperand: state.currentoperand.slice(0, -1),
        }
  default:
    console.log("unknown action");

    
  }
}
function evaluate({ currentoperand, previousoperand, operation }) {
  const prev = parseFloat(previousoperand)
  const current = parseFloat(currentoperand)
  if (isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch (operation) {
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "/":
      computation = prev / current
      break
      default:
        console.log("computational error")
  }

  return computation.toString()
}
export default function App() {
  const [{ currentoperand,operation,previousoperand },dispatch]=useReducer(reducer,{});
  return (
    <div className="calculator-grid">
      <div className='output'>
      <div className='previous-value'>{previousoperand}{operation}</div>
      <div className='current-value'>{currentoperand}</div>
    </div>

    <button className='span-two' onClick={()=>dispatch({ type:ACTIONS.CLEAR,payload:"AC" })}>AC</button>
    <button onClick={()=>dispatch({ type:ACTIONS.DELETE_DIGIT})}>DEL</button>
    <Operation operation="/" dispatch={dispatch}/>
    <Digits digit="1" dispatch={dispatch}/>
    <Digits digit="2" dispatch={dispatch}/>
    <Digits digit="3" dispatch={dispatch}/>
    <Operation operation="*" dispatch={dispatch}/>
    <Digits digit="4" dispatch={dispatch}/>
    <Digits digit="5" dispatch={dispatch}/>
    <Digits digit="6" dispatch={dispatch}/>
    <Operation operation="+" dispatch={dispatch}/>
    <Digits digit="7" dispatch={dispatch}/>
    <Digits digit="8" dispatch={dispatch}/>
    <Digits digit="9" dispatch={dispatch}/>
    <Operation operation="-" dispatch={dispatch}/>
    <Digits digit="0" dispatch={dispatch}/>
    <Digits digit="." dispatch={dispatch}/>
    <button className='span-two' onClick={()=>dispatch({type:ACTIONS.EVALUATE})}>=</button>
    </div>
  );
}
