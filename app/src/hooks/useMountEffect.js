import { useEffect } from "react";


// eslint-disable-next-line react-hooks/exhaustive-deps
const useMountEffect = (f) => useEffect(f, []);

export default useMountEffect;
