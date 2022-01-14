import React, { useState } from 'react'

export const useCustom = () => {
  const [like, setLike] = useState(0);
  const [unlike, setUnlike] = useState(0);
  const increment = () => {
    setLike(prev => prev + 1)
  }
  const decrement = () => {
    setUnlike(prev => prev + 1)
  }
  return [like, unlike, increment, decrement]
}
