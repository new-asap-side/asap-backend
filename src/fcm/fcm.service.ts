import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import admin from 'firebase-admin'


@Injectable()
export class FcmService {
  private static initialized = false;

  constructor(private readonly configService: ConfigService) {
    // Firebase가 아직 초기화되지 않았다면, 한 번만 초기화
    if (!FcmService.initialized) {
      const firebaseConfig = JSON.parse(this.configService.get('FIRE_BASE_CONFIG'));
      const firebaseParams = {
        type: firebaseConfig.type,
        projectId: firebaseConfig.project_id,
        privateKeyId: firebaseConfig.private_key_id,
        privateKey: firebaseConfig.private_key,
        clientEmail: firebaseConfig.client_email,
        clientId: firebaseConfig.client_id,
        authUri: firebaseConfig.auth_uri,
        tokenUri: firebaseConfig.token_uri,
        authProviderX509CertUrl: firebaseConfig.auth_provider_x509_cert_url,
        clientX509CertUrl: firebaseConfig.client_x509_cert_url,
      };

      admin.initializeApp({ credential: admin.credential.cert(firebaseParams) });

      FcmService.initialized = true;  // 초기화가 완료된 후, initialized 플래그를 true로 설정
    }
  }

   // Subscribe the user to a topic (e.g., alarm-${userId})
  async subscribeToTopic(fcmToken: string, group_id: number): Promise<void> {
    const topic = `group-${group_id}`;

    try {
      await admin.messaging().subscribeToTopic([fcmToken], topic);
      console.log(`User ${group_id} subscribed to topic ${topic}`);
    } catch (error) {
      console.error('Error subscribing to topic', error);
    }
  }

  // Send notification to a topic
  async sendNotificationToTopic(fcmToken: string, message: string): Promise<void> {
    const messagePayload = {
      notification: {
        title: 'Group Alarm',
        body: message,
      },
      data: {
        title: 'Group Alarm',
        body: message,
      },
      token: fcmToken,
    };

    try {
      await admin.messaging().send(messagePayload);
      console.log(`Notification sent to fcmToken ${fcmToken}`);
    } catch (error) {
      console.error('Error sending notification', error);
    }
  }
}