import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Bug} from "../bug-report/bug-report.component";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private db: AngularFirestore) {
  }

  getBugReports() {
    return this.db.collection<Bug>('Bugs').valueChanges();
  }

  getPosts(){
    return this.db.collection('posts').valueChanges();
  }
}
