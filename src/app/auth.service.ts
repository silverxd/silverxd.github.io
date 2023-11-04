import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Router} from "@angular/router";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginFailedSubject = new Subject<boolean>();
  public loginFailed$ = this.loginFailedSubject.asObservable();

  constructor(private afAuth: AngularFireAuth, private router: Router) { }
  register(email: string, password: string) {
    this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        if (userCredential.user) {
          // Registration successful
          // Send email verification
          userCredential.user.sendEmailVerification()
            .then(() => {
              // Email sent successfully
              alert('A verification email has been sent to your email address. Please verify your email before logging in.');
              this.router.navigate(['/login']); // Redirect to login page after registration
            })
            .catch((error) => {
              console.error('Error sending email verification:', error);
              alert('An error occurred while sending the verification email. Please try again.');
            });
        } else {
          console.error('User is null');
          alert('An error occurred during registration. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Registration error:', error);
        alert('An error has occurred during registration. Please try again.');
      });
  }
  login(email: string, password: string) {
    this.afAuth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        if (userCredential.user) {
          // Check if the user's email is verified
          if (userCredential.user.emailVerified) {
            // Email is verified, allow login
            this.router.navigate(['/home']);
          } else {
            // Email is not verified, show an error message
            alert('Please verify your email before logging in.');
          }
        } else {
          console.error('User is null');
          alert('An error occurred during login. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
        this.loginFailedSubject.next(true);
      });
  }
  logout() {
    this.afAuth.signOut()
      .then(() => {
        // Logout successful
      })
      .catch((error) => {
        // An error occurred
      });
  }
  sendPasswordResetEmail(email: string) {
    this.afAuth.sendPasswordResetEmail(email)
      .then(() => {
        // Password reset email sent successfully
        alert('A password reset email has been sent to your email address. Please check your email to reset your password.');
        this.router.navigate(['/login']); // Redirect to login page
      })
      .catch((error) => {
        console.error('Error sending password reset email:', error);
        alert('An error occurred while sending the password reset email. Please try again.');
      });
  }
}
