import lowdb from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import { nanoid } from "nanoid";
import { Disc } from "./model/Disc";

class DAO {
  
  db = lowdb(new FileSync("db.json"));

  constructor() {
    this.db.defaults({ discs: [] }).write();
  }

  listProducts(): Disc[] {
    return sortByName(this.db.get("discs").value());
  }

  findProduct(id: string): Disc {
    // @ts-ignore
    return this.db.get("discs").find({ id }).value();
  }

  createProduct(data: any): void {
    // @ts-ignore
    this.db.get("discs").push(new Disc(nanoid(), data.name, data.author))
      .write();
  }

  updateProduct(disc: Disc): void {
    // @ts-ignore
    this.db.get("discs").find({ id: disc.id })
      .assign({ name: disc.name, author: disc.author })
      .write();
  }

  deleteProduct(id: string): void {
    // @ts-ignore
    this.db.get("discs").remove({ id: id }).write();
  }
}

function sortByName(discs: Disc[]): Disc[] {
  return discs.sort((a: Disc, b: Disc) =>
    a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
  );
}

let dao: DAO = new DAO();
export default dao;
