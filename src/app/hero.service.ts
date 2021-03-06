import {
  Injectable,
  ɵCompiler_compileModuleSync__POST_R3__
} from "@angular/core";
import { Observable, of } from "rxjs";
import { Hero } from "./hero";
// import { HEROES } from './mock-heroes';
import { MessageService } from "./message.service";
import * as firebase from "firebase/app";
import "firebase/firestore";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "angularfire2/firestore";

@Injectable({
  providedIn: "root"
})
export class HeroService {
  db = firebase.firestore();

  docRef = this.db.collection("heroes");

  constructor(private messageService: MessageService) {}

  addHero(addName: string): void {
    if (addName === "" || addName === null) {
      console.log("Please enter a value");
    } else {
      const docData = {
        name: addName
      };
      this.messageService.add(`Hero Service: added ${docData.name}`);
      this.db
        .collection("heroes")
        .doc()
        .set(docData);
    }
  }

  getHeroes(): Observable<Hero[]> {
    let heroArr: Hero[] = [];

    this.docRef.onSnapshot(heroes => {
      // heroArr = [];
      heroes.docs.forEach(element => {
        let hero: Hero = { id: element.id, name: element.get("name") };

        heroArr.push(hero);
      });
    });
    return of(heroArr);
  }

  getLimitedHeroes(limit: number): Observable<Hero[]> {
    const heroArr: Hero[] = [];

    this.docRef.limit(limit).onSnapshot(heroes => {
      heroes.docs.forEach(element => {
        let hero: Hero = { id: element.id, name: element.get("name") };
        heroArr.push(hero);
      });
    });
    return of(heroArr);
  }

  async getHero(id: string): Promise<Observable<Hero>> {
    this.messageService.add(`HeroService: fetched hero id=${id}`);

    let hero: Hero = await this.db
      .collection("heroes")
      .doc(id)
      .get()
      .then(doc => {
        const newHero: Hero = {
          id: doc.id,
          name: doc.get("name")
        };
        return newHero;
      });

    return of(hero);
  }

  updateHero(id: string, newName: string): void {
    this.messageService.add(
      `Hero Service: updated hero id: ${id} to name: ${newName}`
    );

    this.db
      .collection("heroes")
      .doc(id)
      .update({
        name: newName
      });
  }

  deleteHero(id: string) {
    this.db
      .collection("heroes")
      .doc(id)
      .delete();
  }

  searchHeroes(name: string): Observable<Hero[]> {
    let heroArr: Hero[] = [];

    this.db
      .collection("heroes")
      .where("name", "==", name)
      .onSnapshot(query => {
        query.docs.forEach(doc => {
          let hero: Hero = { id: doc.id, name: doc.get("name") };

          heroArr.push(hero);
        });
      });

    return of(heroArr);
  }
}
