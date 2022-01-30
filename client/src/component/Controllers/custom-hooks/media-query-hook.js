import { useState, useEffect } from "react";

const useMedia = (query, defaultQuery = window.matchMedia(query)) => {
  const [state, setState] = useState(defaultQuery);

  useEffect(() => {
    const media = window.matchMedia(query);

    if(media.matches!== state) setState(media.matches);
    const listener = () => setState(media.matches);
    
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [query, state]);

  return state;
}

export default useMedia;