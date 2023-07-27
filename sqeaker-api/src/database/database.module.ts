import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Firestore, getFirestore } from '@firebase/firestore';
import { initializeApp } from '@firebase/app';
import { UserRepositry } from './implementations/user.repository';

function getConfigObject(configService: ConfigService) {
  return {
    apiKey: configService.get('FIREBASE_API_KEY'),
    authDomain: configService.get('FIREBASE_AUTH_DOMAIN'),
    projectId: configService.get('FIREBASE_PROJECT_ID'),
    storageBucket: configService.get('FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: configService.get('FIREBASE_MESSAGING_SENDER_ID'),
    appId: configService.get('FIREBASE_APP_ID'),
    measurementId: configService.get('FIREBASE_MEASURMENT_ID'),
  };
}

@Module({
  providers: [
    {
      provide: Firestore,
      useFactory: async (configService: ConfigService) => {
        Logger.debug('[!] Initialzing firestore...');
        const app = initializeApp(getConfigObject(configService));
        return getFirestore(app);
      },
      inject: [ConfigService],
    },
  ],
  imports: [UserRepositry],
  exports: [UserRepositry],
})
export class DatabaseModule {}
