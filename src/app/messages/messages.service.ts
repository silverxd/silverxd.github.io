export interface Message {
  id?: string
  senderId: string;
  content: string;
  timestamp: Date;
}

import {Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable, of} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private chatIdSubject = new BehaviorSubject<string>(''); // Initial value is an empty string
  chatId$ = this.chatIdSubject.asObservable();

  private friendIDSubject = new BehaviorSubject<string>('');
  friendID = this.friendIDSubject.asObservable();

  constructor(private db: AngularFirestore) {
  }

  setChatId(chatId: string, friendID: string): void {
    this.chatIdSubject.next(chatId);
    this.friendIDSubject.next(friendID)
  }

  sendMessage(message: Message, chatId: string): Promise<void> {
    // Ensure that chatId is not null or undefined

    // Use 'then' to handle the DocumentReference returned by add
    return this.db.collection(`Chats/${chatId}/messages`).add(message)
      .then(() => {
        // Additional logic if needed
      })
      .catch((error) => {
        console.error('Error sending message:', error);
        throw error; // Re-throw the error to propagate it
      });
  }

  getMessages(chatId: string): Observable<Message[]> {
    return this.db
      .collection(`Chats/${chatId}/messages`, (ref) => ref.orderBy('timestamp'))
      .valueChanges({idField: 'id'})
      .pipe(
        map((messages: any[]) => {
          return messages.map((message) => ({
            id: message.id,
            senderId: message.senderId,
            content: message.content,
            timestamp: message.timestamp.toDate(),
          }));
        })
      );
  }

  getFriend(friendID: string): Observable<any> {
    return this.db.collection('User').doc(friendID).valueChanges();
  }
}
