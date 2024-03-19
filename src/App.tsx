import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { canvasHeight, canvasWidth, detectCollision, handleWallCollision, resolveCollision, resolvePenetration } from './util';
import Circle from './Circle';
import Vector2 from './Vector';
import Options from './components/Options';
import './App.sass'

function App() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const popUp = useRef <HTMLDivElement | null>(null);
  const [force, setForce] = useState(10);
  const [paused, setPaused] = useState(false);
  const [color, setColor] = useState('#ffffff');
  const [balls, setBalls] = useState<Circle[] | null>(null);
  const [playerBall, setPlayerBall] = useState<Circle | null>(null);
  // const now = useRef(Date.now());
  // const delta = useRef(0);

  const getContext = () => ref.current?.getContext('2d');

  const getMouseVector = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const mouseX = e.clientX - e.currentTarget.offsetLeft;
    const mouseY = e.clientY - e.currentTarget.offsetTop;
    return new Vector2(mouseX, mouseY);
  }

  const createBallsLayout = () => {
    const ctx = getContext();
    if (!ctx)
      return;
    const balls = [];
    for (let i = 1; i <= 5; i++) {
      for (let j = 0; j < i; j++) {
        //Magic for balls layout as pyramid
        balls.push(new Circle(ctx, j * 15 * 2 + 315 - i * 15, -(i * 15 * 2 * Math.sin(Math.PI / 3)) + 315, 15))
      }
    }
    balls.push(new Circle(ctx, 300, 700, 15));
    balls.at(-1)!.color = 'white';
    return balls;
  }

  useEffect(() => {
    const balls = createBallsLayout();
    if (!balls)
      return;

    setBalls(balls);
    setPlayerBall(balls.at(-1) as Circle);
  }, [ref.current])

  useEffect(() => {
    if (!playerBall)
      return;
    playerBall.color = color;
  }, [color])

  useLayoutEffect(() => {
    const id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [balls])


  const loop = () => {
    requestAnimationFrame(loop);
    // delta.current = now.current - Date.now();
    // const interval = 1000 / FPS;
    // if (delta.current * -1 < interval)
    //   return;
  
    // now.current = Date.now();

    const ctx = getContext();
    if (!ctx || !balls)
      return;

    ctx.clearRect(0,0, canvasWidth, canvasHeight);

    balls.forEach((b, index) => {
      for (let i = 0; i < balls.length; i++) {
        for (let j = index + 1; j < balls.length; j++) {
          if (detectCollision(balls[index], balls[j])) {
            resolvePenetration(balls[index], balls[j]);
            resolveCollision(balls[index], balls[j]);
          }
          handleWallCollision(balls[i]);
        }
      }
      b.move();
      b.drawCircle();
    })
  }

  const handleBallClick = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!paused)
    return;

    const mouseVector = getMouseVector(e);
    const popup = popUp.current as HTMLDivElement;
    if (mouseVector.sub(playerBall!.position).magnitude() < playerBall!.radius) {
      popup.style.top = `${e.clientY}px`;
      popup.style.left = `${e.clientX + 20}px`;
      popup.classList.toggle('hidden');
    } else {
      popup.classList.add('hidden');
    }
  }

  const handleBallPush = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const mouseVector = getMouseVector(e);
    if (!playerBall || paused)
      return;

    if (mouseVector.sub(playerBall.position).magnitude() < playerBall.radius && mouseVector.sub(playerBall.position).magnitude() > 13) {
      const distNormal = mouseVector.sub(playerBall.position).normalized();
      playerBall.vel = distNormal.mult(-force);
    }
  }

  return (
    <>
      <canvas ref={ref} id='canvas' width={canvasWidth} height={canvasHeight} tabIndex={0} onMouseMoveCapture={handleBallPush} onClickCapture={handleBallClick}></canvas>
      <Options force={force} paused={paused} setForce={setForce} setPaused={setPaused}/>
      <div className="colors-container hidden" ref={popUp}>
        <input type="color" name="color" id="color" value={color} onChange={(e) => setColor(e.currentTarget.value)}/>
      </div>
      <a href="https://github.com/ChandeOk/billiard-test">How to play</a>
    </>
  )
}

export default App
