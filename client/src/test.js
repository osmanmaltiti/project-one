import React, { useState } from 'react';
import { useMedia } from './testHook';


const Test = () => {
  const xs = useMedia('(max-width: 350px)');
  const md = useMedia('(max-width: 600px)');
  const lg = useMedia('(max-width: 1000px)');
  return <div>
    { xs ? 'Iphone' : md ? 'Ipad' : lg ? "MacBook" : "Projector" }
  </div>
};

export default Test;
