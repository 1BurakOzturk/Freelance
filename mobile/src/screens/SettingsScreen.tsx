import React from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { useMutation } from '@tanstack/react-query';

import { Button, Card, H1, Label, Screen } from '../ui';
import { theme } from '../theme';
import { API_BASE_URL, healthCheck } from '../api';
import { clearToken } from '../authStore';

export function SettingsScreen(props: { onLogout: () => void }) {
  const pingM = useMutation({
    mutationFn: async () => {
      return await healthCheck();
    },
    onSuccess: () => Alert.alert('Bağlantı', 'Backend OK ✅'),
    onError: (e: any) => Alert.alert('Bağlantı', String(e?.response?.data?.error ?? e?.message ?? 'network_error')),
  });

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: theme.spacing.lg, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <H1>Ayarlar</H1>

        <Card>
          <Label>Bağlantı</Label>
          <Text style={{ color: theme.colors.text, fontSize: 15, lineHeight: 22 }}>API: {API_BASE_URL}</Text>
          <Text style={{ color: theme.colors.muted, fontSize: 13, lineHeight: 18 }}>
            Android emulator: 10.0.2.2. iOS simulator: localhost. Gerçek cihaz: LAN IP.
          </Text>

          <Button
            title={pingM.isPending ? 'Test ediliyor…' : 'Bağlantıyı Test Et'}
            variant="secondary"
            disabled={pingM.isPending}
            onPress={() => pingM.mutate()}
          />
        </Card>

        <Card>
          <Label>Hesap</Label>
          <Button
            title="Çıkış Yap"
            onPress={() =>
              Alert.alert('Çıkış', 'Emin misin?', [
                { text: 'Vazgeç', style: 'cancel' },
                {
                  text: 'Çıkış Yap',
                  style: 'destructive',
                  onPress: async () => {
                    await clearToken();
                    props.onLogout();
                  },
                },
              ])
            }
          />
        </Card>
      </ScrollView>
    </Screen>
  );
}
