export interface Message {
  id?: string
  senderId: string;
  content: string;
  timestamp: Date;
}

import {Injectable} from '@angular/core';
import {map, Observable} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(private db: AngularFirestore) {
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
      .valueChanges({ idField: 'id' })
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
}
