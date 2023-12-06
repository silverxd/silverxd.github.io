import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {map, take} from "rxjs";
import {AuthService} from "../auth.service";

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    user: any;

    constructor(private firestore: AngularFirestore, private authservice: AuthService) {
        this.authservice.user$.subscribe(value => {
            this.user = value?.uid;
        })
    }

    searchUsers(displayName: string | undefined) {
        return this.firestore.collection('User', ref =>
            ref
                .where('displayName', '>=', displayName || '')
                .where('displayName', '<=', (displayName || '') + '\uf8ff'))
            .valueChanges({idField: 'userUID'}) // Specify the field name for the document ID
            .pipe(
                map((users: any[]) =>
                    users
                        .filter((user: any) => user.userUID !== this.user) // Exclude the current user
                        .map((user: any) => ({
                            debux: user.Debux,
                            name: user.displayName,
                            userUID: user.userUID, // Include the userUID
                            pic: "#C91CAD",
                        }))
                )
            );
    }

    getTopUsersOnce(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.firestore.collection('User', ref =>
                ref.orderBy('Debux', 'desc').limit(4))
                .valueChanges({idField: 'userUID'})
                .pipe(
                    take(1),
                    map((users: any[]) =>
                        users
                            .filter((user: any) => user.userUID !== this.user) // Exclude the current user
                            .map((user: any) => ({
                                debux: user.Debux,
                                name: user.displayName,
                                userUID: user.userUID,
                                pic: "#C91CAD",
                            }))
                    )
                )
                .subscribe(
                    (data) => resolve(data),
                    (error) => reject(error)
                );
        });
    }
}
