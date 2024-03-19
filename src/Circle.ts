import Vector2 from './Vector';
import { canvasHeight, canvasWidth } from './util';

class Circle {
  private ctx: CanvasRenderingContext2D;
  readonly radius: number;
  readonly friction = 0.005;
  readonly acceleration = 0.3;
  readonly mass = 3;
  readonly invMass = 1 / this.mass;
  public color = 'red';
  public position: Vector2;
  public vel = new Vector2(0, 0);
  public acc = new Vector2(0, 0);

  constructor(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) {
    this.ctx = ctx;
    this.position = new Vector2(x, y);
    this.radius = radius;
  }

  drawCircle = () => {
    //This cause to clear full canvas and not show second ball
    //This cause to clear full canvas and not show second ball
    // this.ctx.clearRect(0,0, canvasWidth, canvasHeight);
    this.ctx.beginPath();
    this.ctx.beginPath();
    this.ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI / 180 * 360);
    this.ctx.strokeStyle = 'black';
    this.ctx.stroke();
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawGizmo = () => {
    this.ctx.beginPath();
    this.ctx.moveTo(this.position.x, this.position.y);
    this.ctx.lineTo(this.position.x + this.acc.x * 100, this.position.y + this.acc.y * 100);
    this.ctx.strokeStyle = 'blue';
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(this.position.x, this.position.y);
    this.ctx.lineTo(this.position.x + this.vel.x * 50, this.position.y + this.vel.y * 50);
    this.ctx.strokeStyle = 'yellow';
    this.ctx.stroke();
    this.ctx.closePath();
  }
}

export default Circle;