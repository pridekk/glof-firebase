import {
  initializeApp,
  firestore,
} from "firebase-admin";
import axios, {AxiosInstance} from "axios";
initializeApp();

const db = firestore();

// const db = firestore();
export const customAxios: AxiosInstance = axios.create({
  baseURL: `${process.env.API_BASE_URL}`, // 기본 서버 주소 입력
});
// const GET_TILE_OWNERS_URL = `${process.env.API_BASE_URL}/lands/owners`;

// const landOwners = db.collection("landOwner");

const ZOOM = 18;
const SCALE = 1 << ZOOM;

// eslint-disable-next-line max-len
export const getTiles = async (south: number, west: number, north: number, east: number ) => {
  const southEastPoint = project(south, east);
  const northWestPoint = project(north, west);


  const southEastTile = calculateTile(southEastPoint);
  const northWestTile = calculateTile(northWestPoint);

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

// eslint-disable-next-line max-len
export const getOwnersInTiles = async (token: string, northWest: PointType, southEast: PointType) => {
  const response =
    // eslint-disable-next-line max-len
    await customAxios.get<any, any>(`/lands/owners?north=${northWest.y}&souht=${southEast.y}&west=${northWest.x}&east=${southEast.y}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  return response;
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
