import {Input, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from "@angular/forms";
import { AdminComponent } from './admin/admin.component';
import { HeaderComponent } from './header/header.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from  '@angular/material/list'
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PostComponent } from './post/post.component';
import {HttpClientModule} from "@angular/common/http";
import {AngularFireModule} from "@angular/fire/compat";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    AdminComponent,
    HeaderComponent,
    PostComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    HttpClientModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyDdqKeVXZLeAeRIzFuvh1-4snVV-G9LK34",
      authDomain: "earn2post.firebaseapp.com",
      projectId: "earn2post",
      storageBucket: "earn2post.appspot.com",
      messagingSenderId: "627810397108",
      appId: "1:627810397108:web:9c06f50115255b39cf20e1"
    }),
    AngularFireAuthModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {
}
