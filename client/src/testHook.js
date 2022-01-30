import { useEffect } from "react";
import { useState } from "react";

export const useMedia = (query) => {
  const [state, setState] = useState();

  useEffect(() => {
    const media = window.matchMedia(query);
    const mediaFunc = (e) => {
      e.matches ? setState(media.matches) :
        setState(media.matches)
      }
    
    media.addEventListener('change', mediaFunc)

    return () => media.removeEventListener('change', mediaFunc)
    
  }, [query, state])
  return state
}

