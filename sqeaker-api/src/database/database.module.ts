import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Firestore, getFirestore } from '@firebase/firestore';
import { initializeApp } from '@firebase/app';
import { UserRepositry } from './repositories/user.repository';
import { PostRepsitory } from './repositories/posts.repository';

function getConfigObject(configService: ConfigService) {
  const firebaseConfig = {
    apiKey: configService.get('FIREBASE_API_KEY'),
    authDomain: configService.get('FIREBASE_AUTH_DOMAIN'),
    projectId: configService.get('FIREBASE_PROJECT_ID'),
    storageBucket: configService.get('FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: configService.get('FIREBASE_MESSAGING_SENDER_ID'),
    appId: configService.get('FIREBASE_APP_ID'),
    measurementId: configService.get('FIREBASE_MEASURMENT_ID'),
    databaseURL:
      'https://squeaker-api-default-rtdb.europe-west1.firebasedatabase.app/',
  };

  return firebaseConfig;
}

@Module({
  providers: [
    {
      provide: Firestore,
      useFactory: async (configService: ConfigService) => {
        Logger.log('[!] Initialzing firestore...');
        const app = initializeApp(getConfigObject(configService));
        return getFirestore(app);
      },
      inject: [ConfigService],
    },
    UserRepositry,
    PostRepsitory,
  ],
  imports: [ConfigModule],
  exports: [UserRepositry, PostRepsitory],
})
export class DatabaseModule {}
