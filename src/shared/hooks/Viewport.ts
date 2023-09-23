import React, { useEffect, useMemo, useState } from 'react';

/**
 * Observe whether the current element is in the viewport or not.
 * @param ref reference to html element
 * @returns boolean if html element is in view port 
 */

function useViewportObserver(ref: React.RefObject<Element>) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observer = useMemo(() => new IntersectionObserver(([entry]) => setIsIntersecting(entry.isIntersecting)), []);

  useEffect(() => {
    ref.current && observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [ref, observer]);

  return isIntersecting;
}

export default useViewportObserver;
