import { useEffect, useRef } from "react";
import { FireFlame } from "@9am/fire-flame-react";


type FireFlameInstance = {
  start: () => void;
  stop: () => void;
  set: (options: { x: number; y: number }) => void;
};

interface FireFlameProps {
    color: "red" | "blue",
}

export const Fireflame = ({ color }: FireFlameProps) => {
  const instance = useRef<FireFlameInstance | null>(null);

  const flameColor = color === 'blue'
    ? { innerColor: "blue", outerColor: "blueviolet" }
    : { innerColor: "orange", outerColor: "orangered" };


  const option = {
    painter: "canvas",
    w: 100,
    h: 120,
    x: 30,
    y: 116,
    mousemove: false,
    ...flameColor,
    sizeCurveFn: (x: number) =>
      x > 0.7
        ? Math.sqrt(1 - x) * 50
        : Math.pow(x - 1, 2) * -30 + 30
      
  };

  useEffect(() => {
    instance.current?.start();
  }, []);

  return (
    <div className="h-32 w-20 overflow-hidden">
        <FireFlame option={option} ref={instance} />
    </div>
  );
};
