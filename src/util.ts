import Circle from './Circle';
import Vector2 from './Vector';

export const enum Colors {
  RED = 'red',
  BLACK = 'black',
  BLUE = 'blue',
  GREEN = 'green',
  PURPLE = 'purple',
}

export const canvasWidth = 600;
export const canvasHeight = 800;

export const FPS = 70;
const ballElasticity = 1;
const wallElasticity = 0.8;

export const detectCollision = (ball1: Circle, ball2: Circle) =>
 ball1.position.sub(ball2.position).magnitude() < ball1.radius + ball2.radius;

export const resolvePenetration = (ball1: Circle, ball2: Circle) => {
  const distanceVector = ball1.position.sub(ball2.position);
  const penDepth = ball1.radius + ball2.radius - distanceVector.magnitude();

  const res = distanceVector.normalized().mult(penDepth / 2);

  ball1.position = ball1.position.add(res);
  ball2.position = ball2.position.add(res.mult(-1));
}

export const resolveCollision = (ball1: Circle, ball2: Circle) => {
  const normal = ball1.position.sub(ball2.position).normalized();
  const relativeVelocity = ball1.vel.sub(ball2.vel);
  const separationVelocityLength = Vector2.dot(relativeVelocity, normal);
  const newSeparationVelocityLength = -separationVelocityLength * ballElasticity;
  // const separationVelocityVector = normal.mult(newSeparationVelocityLength);
  const separationVelocityDiff = newSeparationVelocityLength - separationVelocityLength;
  const impulseLength = separationVelocityDiff / (ball1.invMass + ball2.invMass);
  const impulseVector = normal.mult(impulseLength);

  ball1.vel = ball1.vel.add(impulseVector.mult(ball1.invMass));
  ball2.vel = ball2.vel.add(impulseVector.mult(-ball2.invMass));
}

export const handleWallCollision = (ball: Circle) => {
  let ballPen: number;
  const isCollisionY = ball.position.y < ball.radius || ball.position.y + ball.radius > canvasHeight;
  const isCollisionX = ball.position.x < ball.radius || ball.position.x + ball.radius > canvasWidth;
  if (isCollisionY) {
    if (ball.position.y < ball.radius) {
      ballPen = ball.radius - ball.position.y;
      ball.position.y += ballPen;
    }
    else {
      ballPen = canvasHeight - ball.radius - ball.position.y; 
      ball.position.y += ballPen;
    }
    ball.vel.y = -ball.vel.y * wallElasticity;
    return;
  }
  if (isCollisionX) {
    if (ball.position.x < ball.radius) {
      ballPen = ball.radius - ball.position.x;
      ball.position.x += ballPen;
    }
    else {
      ballPen = canvasWidth - ball.radius - ball.position.x; 
      ball.position.x += ballPen;
    }
    ball.vel.x = -ball.vel.x * wallElasticity;
    return;
  }
}