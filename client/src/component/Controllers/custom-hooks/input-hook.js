import { useState } from 'react';

const useInput = (init) => {
  const [value, setValue] = useState(init);
  const reset = () => {
    setValue(init);
  }
  const bind = {
    value,
    onChange: (e) => setValue(e.target.value),
  }
  return [bind, reset]
}

export default useInput;