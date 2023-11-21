import {Injectable, OnInit} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Router} from "@angular/router";
import {map, Observable, Subject} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginFailedSubject = new Subject<boolean>();
  public loginFailed$ = this.loginFailedSubject.asObservable();
  user$: Observable<firebase.default.User | null>;

  constructor(private afAuth: AngularFireAuth, private router: Router, private db: AngularFirestore) {
    this.user$ = this.afAuth.authState;
  }


  register(email: string, password: string, displayName: string) {
    this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        if (userCredential.user) {
          const uid = userCredential.user.uid; // Retrieve UID here
          const userData = {
            displayName: displayName,
            // Add other user data as needed
          };
          // Registration successful
          // Send email verification
          userCredential.user.updateProfile({
            displayName: displayName
          })
            .then(() => {
              // Display name has been set
              console.log('Display name set successfully');
            })
            .catch((error) => {
              console.error('Error setting display name:', error);
            });
          userCredential.user.sendEmailVerification()
            .then(() => {
              // Email sent successfully
              alert('A verification email has been sent to your email address. Please verify your email before logging in.');
              this.db.collection('User').doc(uid).set(userData);
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

  login(email: string, password: string, rememberMe: boolean) {
    this.afAuth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        if (userCredential.user) {
          const user = userCredential.user;
          const email = user.email;
          const displayName = user.displayName;

          // Check if the user's email is verified
          if (userCredential.user.emailVerified) {
            // Email is verified, allow login
            console.log(rememberMe)
            if (!rememberMe) {
              this.afAuth.setPersistence('none')
                .then(() => {
                  console.log('Remembering account is turned off')
                })
            }
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
        console.log('Logged out')
        this.router.navigate(['/login']);
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

  autoLogin() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        // User is authenticated, redirect to another page
        this.router.navigate(['/home']); // Replace '/dashboard' with your desired route
      }
    });
  }

  isLoggedIn(): Observable<boolean> {
    return this.user$.pipe(map(user => !!user));
  }
}
