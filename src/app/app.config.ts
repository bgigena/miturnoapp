import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {AngularFireModule} from "@angular/fire/compat";


const firebaseConfig = {
  apiKey: "AIzaSyCE5xDeDXAKKuaVljZ5tCJK42A6UqtBUdI",
  authDomain: "miturnoapp-dc60d.firebaseapp.com",
  projectId: "miturnoapp-dc60d",
  storageBucket: "miturnoapp-dc60d.firebasestorage.app",
  messagingSenderId: "17283096929",
  appId: "1:17283096929:web:49066d89c9cf1105662520",
  measurementId: "G-5K5XYDJYVR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    importProvidersFrom(
      CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory,
      })
    ),
    importProvidersFrom(AngularFireModule.initializeApp(firebaseConfig)),
    
  ]
};
