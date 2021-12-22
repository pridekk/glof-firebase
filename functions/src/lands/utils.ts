

const ZOOM = 18;
const SCALE = 1 << ZOOM;

export const getTiles = (south: number, west: number, north: number, east: number ) => {
  const southWestPoint = project(south, west);
  const northEastPoint = project(north, east);


  const southWestTile = calculateTile(southWestPoint);
  const northEastTile = calculateTile(northEastPoint);


  console.log(southWestTile);
  console.log(northEastTile);

  return [southWestTile, northEastTile];
};

const calculateTile = (point: PointType) => {
  const tileCoordinate = new PointType(
      Math.floor((point.x * SCALE) / TILE_SIZE),
      Math.floor((point.y * SCALE) / TILE_SIZE)
  );
  return tileCoordinate;
};

// const getTiles = (x: number, y: number) => console.log(x, y);
const TILE_SIZE = 256;

const project = (lat: number, lng: number) => {
  let siny = Math.sin((lat * Math.PI) / 180);

  // Truncating to 0.9999 effectively limits latitude to 89.189. This is
  // about a third of a tile past the edge of the world tile.
  siny = Math.min(Math.max(siny, -0.9999), 0.9999);

  // eslint-disable-next-line max-len
  return new PointType(TILE_SIZE * (0.5 + lng / 360), TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)));
};


// eslint-disable-next-line require-jsdoc
class PointType {
  x: number;
  y: number ;
  // eslint-disable-next-line require-jsdoc
  constructor(x:number, y:number) {
    this.x = x;
    this.y = y;
  }
}
