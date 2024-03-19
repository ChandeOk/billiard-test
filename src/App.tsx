import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Colors, FPS, canvasHeight, canvasWidth, detectCollision, handleWallCollision, resolveCollision, resolvePenetration } from './util';
import Circle from './Circle';
import './App.sass'
import Vector2 from './Vector';

enum Direction {
  LEFT = 'ArrowLeft',
  UP = 'ArrowUp',
  RIGHT = 'ArrowRight',
  DOWN = 'ArrowDown',
}

function App() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  // const left = useRef(false);
  // const right = useRef(false);
  // const up = useRef(false);
  // const down = useRef(false);
  const now = useRef(Date.now());
  const delta = useRef(0);
  const frames = useRef(0);
  const [force, setForce] = useState(10);
  const [paused, setPaused] = useState(false);
  const [color, setColor] = useState('#ffffff');
  const popUp = useRef <HTMLDivElement | null>(null);
  const [balls, setBalls] = useState<Circle[] | null>(null);

  const move = (ball: Circle) => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');

    if (!ctx)
      return;

    ball.acc = ball.acc.normalized().mult(ball.acceleration);
    ball.vel = ball.vel.add(ball.acc);
    ball.vel = ball.vel.mult(1 - ball.friction);

    ball.position = ball.position.add(ball.vel)
  }

  // const playerController = (ball: Circle) => {
  //   if (up.current)
  //     ball.acc.y = -ball.acceleration;
  //   if (right.current)
  //     ball.acc.x = ball.acceleration;
  //   if (down.current)
  //     ball.acc.y = ball.acceleration;
  //   if (left.current)
  //     ball.acc.x = -ball.acceleration;

  //   if (!up.current && !down.current)
  //     ball.acc.y = 0;
  //   if (!left.current && !right.current)
  //     ball.acc.x = 0;

  // }
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx)
      return;

    const balls = [];
    for (let i = 1; i <= 5; i++) {
      for (let j = 0; j < i; j++) {
        //Magic for balls layout
        balls.push(new Circle(ctx, j * 15 * 2 + 315 - i * 15, -(i * 15 * 2 * Math.sin(Math.PI / 3)) + 315, 15))
      }
    }
    balls.push(new Circle(ctx, 300, 700, 15));
    balls.at(-1)!.color = 'white';
    setBalls(balls);
  }, [ref.current])

  const loop = () => {
    requestAnimationFrame(loop);
    delta.current = now.current - Date.now();
    const interval = 1000 / FPS;
    if (delta.current * -1 < interval)
      return;
  
    frames.current++;
    now.current = Date.now();
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx)
      return;
    if (!balls) 
      return;

    ctx.clearRect(0,0, canvasWidth, canvasHeight);
    balls.forEach((b, index) => {
      // playerController(balls.at(-1) as Circle);
      b.drawCircle();
      move(b);
      for (let i = 0; i < balls.length; i++) {
        for (let j = index + 1; j < balls.length; j++) {
          if (detectCollision(balls[index], balls[j])) {
            resolvePenetration(balls[index], balls[j]);
            resolveCollision(balls[index], balls[j]);
          }
          handleWallCollision(balls[i]);
        }
      }
    })
  }

  useLayoutEffect(() => {
    const id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [balls])

  return (
    <>
      <canvas ref={ref} id='canvas' width={canvasWidth} height={canvasHeight} tabIndex={0}
      // onKeyDown={(e) => {
      //   switch (e.key) {
      //     case Direction.UP:
      //       up.current = true;
      //       break;
      //     case Direction.RIGHT:
      //       right.current = true;
      //       break;
      //     case Direction.DOWN:
      //       down.current = true;
      //       break;
      //     case Direction.LEFT:
      //       left.current = true
      //       break;
      //     default:
      //       break;
      //   }
      // }}
      // onKeyUp={(e) => {
      //   switch (e.key) {
      //     case Direction.UP:
      //       up.current = false;
      //       break;
      //     case Direction.RIGHT:
      //       right.current = false;
      //       break;
      //     case Direction.DOWN:
      //       down.current = false;
      //       break;
      //     case Direction.LEFT:
      //       left.current = false;
      //       break;
      //     default:
      //       break;
      //   }
      // }}
      onMouseMoveCapture={e => {
        const mouseX = e.clientX - e.currentTarget.offsetLeft;
        const mouseY = e.clientY - e.currentTarget.offsetTop;
        const mouseVector = new Vector2(mouseX, mouseY);
        const playerBall = balls?.at(-1);
        if (!playerBall || paused)
          return;
        if (mouseVector.sub(playerBall.position).magnitude() < playerBall.radius && mouseVector.sub(playerBall.position).magnitude() > 13) {
          const distNormal = mouseVector.sub(playerBall.position).normalized();
          playerBall.vel = distNormal.mult(-force);
        }
      }}
      onClickCapture={e => {
        const mouseX = e.clientX - e.currentTarget.offsetLeft;
        const mouseY = e.clientY - e.currentTarget.offsetTop;
        const mouseVector = new Vector2(mouseX, mouseY);
        const playerBall = balls?.at(-1);
        if (mouseVector.sub(playerBall!.position).magnitude() < playerBall!.radius) {
          const popup = popUp.current as HTMLDivElement;
          popup.style.top = `${e.clientY}px`
          popup.style.left = `${e.clientX + 20}px`;
          popup.classList.toggle('hidden');
        }
      }}
      ></canvas>
      <div className='options-container'>
      <label htmlFor="force">
      <input type="range" name="force" id="force" min={1} max={20} value={force} onChange={(e) => setForce(+e.currentTarget.value)}/>
      <h2>{force}</h2>
      </label>
      <button onClick={() => setPaused(paused => !paused)}>{paused ? 'Play' : 'Pause'}</button>
      </div>
       <div className="colors-container hidden" ref={popUp}>
        <input type="color" name="color" id="color" value={color} onChange={(e) => {
          setColor(e.currentTarget.value);
          const playerBall = balls?.at(-1);
          console.log(playerBall?.color)
          playerBall!.color = e.currentTarget.value;
        }}/>
      </div>
    </>
  )
}

export default App
