import React from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';

import { Button, Card, H1, Label, Screen } from '../ui';
import { theme } from '../theme';
import { API_BASE_URL } from '../api';
import { clearToken } from '../authStore';

export function SettingsScreen(props: { onLogout: () => void }) {
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: theme.spacing.lg, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <H1>Ayarlar</H1>

        <Card>
          <Label>Bağlantı</Label>
          <Text style={{ color: theme.colors.text, fontSize: 15, lineHeight: 22 }}>API: {API_BASE_URL}</Text>
          <Text style={{ color: theme.colors.muted, fontSize: 13, lineHeight: 18 }}>
            Android emulator için 10.0.2.2 kullanıyoruz. Gerçek cihazda LAN IP’ye geçmek gerekir.
          </Text>
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
