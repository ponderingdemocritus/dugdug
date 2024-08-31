import React, { useState, useEffect } from "react";
import Diamond from "@/components/icons/diamond.svg?react";

interface Coin {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  wobble: number;
}

const CoinFountain = () => {
  const [coins, setCoins] = useState<Coin[]>([]);

  useEffect(() => {
    const createCoin = () => {
      const newCoin: Coin = {
        id: Math.random(),
        x: Math.random() * 100,
        y: 110,
        size: Math.random() * 20 + 5,
        speed: Math.random() * 2 + 1,
        wobble: Math.random() * 2 - 1,
      };
      setCoins((prevCoins) => [...prevCoins, newCoin]);
    };

    const animateCoins = () => {
      setCoins((prevCoins) =>
        prevCoins
          .map((coin) => ({
            ...coin,
            y: coin.y - coin.speed,
            x: coin.x + Math.sin(coin.y / 10) * coin.wobble,
          }))
          .filter((coin) => coin.y + coin.size > 0)
      );
    };

    const coinInterval = setInterval(createCoin, 200);
    const animationInterval = setInterval(animateCoins, 50);

    return () => {
      clearInterval(coinInterval);
      clearInterval(animationInterval);
    };
  }, []);

  return (
    <div className="w-full h-screen overflow-hidden z-50 fixed bottom-0 pointer-events-none">
      <svg className="absolute inset-0 w-full h-full">
        {coins.map((coin) => (
          <Diamond
            key={coin.id}
            x={`${coin.x}%`}
            y={`${coin.y}%`}
            width={coin.size}
            height={coin.size}
          />
        ))}
      </svg>
    </div>
  );
};

export default CoinFountain;
