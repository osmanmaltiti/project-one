import { useReducer, useRef } from 'react';

const init = { like: 0, unlike: 0 }
const reducer = (state, action) => {
  if(state.like == 0 && state.unlike == 0){
    switch(action){ 
      case 'Like': return { like: 1, unlike: 0 }
      case 'Unlike': return { like: 0, unlike: 1 }
    }
  }else if(state.like == 1 && state.unlike == 0){
    switch(action){ 
      case 'Like': return { like: 0, unlike: 0 }
      case 'Unlike': return { like: 0, unlike: 1 }
    }
  }else if(state.like == 0 && state.unlike == 1){
    switch(action){ 
      case 'Like': return { like: 1, unlike: 0 }
      case 'Unlike': return { like: 0, unlike: 0 }
    }
  }else{
    return{ like: 0, unlike: 0 }
  }
}
export const useLike = () => {
  const [state, push] = useReducer(reducer, init); 
  const handleLike = () => {
    push('Like')
    state.current = state
  }
  const handleUnlike = () => {
    push('Unlike')
    state.current = state
  }
  return [state, handleLike, handleUnlike]
}
