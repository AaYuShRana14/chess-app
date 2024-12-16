import { useEffect, useState } from "react";

export const useStockfish = () => {
    const [stockfishs, setStockfish] = useState(null);
    useEffect(()=>{
    const stckfish = new Worker("/stockfish.js");
    setStockfish(stckfish);
    stckfish.postMessage("uci");
    },[])
    return stockfishs;
};
