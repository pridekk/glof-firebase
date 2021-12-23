import {
  initializeApp,
  firestore,
} from "firebase-admin";
initializeApp();

const db = firestore();

const landOwners = db.collection("landOwner");

const ZOOM = 18;
const SCALE = 1 << ZOOM;

// eslint-disable-next-line max-len
export const getTiles = async (south: number, west: number, north: number, east: number ) => {
  const southEastPoint = project(south, east);
  const northWestPoint = project(north, west);


  const southEastTile = calculateTile(southEastPoint);
  const northWestTile = calculateTile(northWestPoint);


  await getOwnersInTiles(northWestTile, southEastTile);
  console.log(southEastTile);
  console.log(northWestTile);

  return [southEastTile, northWestTile];
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

export const getOwnersInTiles = async (northWest: PointType, southEast: PointType) => {
  const landsQuerySnapshot = await landOwners.where("x", "<=", northWest.x)
      .where("x", ">=", southEast.x)
      .where("y", "<=", northWest.y)
      .where("y", ">=", northWest.y)
      .get();

  landsQuerySnapshot.forEach((landSnapshot) => {
    console.log(`Found document at ${landSnapshot.ref.path}`);
  });
};

export class LandOwner {
  x: number
  y: number
  owner: string

  constructor(x:number, y:number, owner: string) {
    this.x = x;
    this.y = y;
    this.owner = owner;
  }
}

export const updateOwners = async (owners:[LandOwner]) => {
  const bulkWriter = db.bulkWriter();
  const documentRef = db.collection("landOwners").doc();

  owners.forEach((owner) => {
    bulkWriter.create(documentRef,
        owner);
  });

  await bulkWriter.close();

  console.log("Executed all writes");
};
