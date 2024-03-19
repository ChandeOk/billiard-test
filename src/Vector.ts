class Vector2 {
  public x: number;
  public y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add = (vector: Vector2) => new Vector2(this.x + vector.x, this.y + vector.y);

  sub = (vector: Vector2) => new Vector2(this.x - vector.x, this.y - vector.y);

  //Scale
  mult = (num: number) => new Vector2(this.x * num, this.y * num);

  //Length
  magnitude = () => Math.sqrt(this.x ** 2 + this.y ** 2);
  
  //Vector with length 1
  normalized = () => this.magnitude() === 0 ? new Vector2(0,0) : new Vector2(this.x / this.magnitude(), this.y / this.magnitude());

  //Perpendicular vector
  normal = () => new Vector2(-this.y, this.x).normalized();

  static dot = (v1: Vector2, v2: Vector2) => v1.x * v2.x + v1.y * v2.y;
}

export default Vector2;