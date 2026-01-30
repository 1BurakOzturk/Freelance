import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Card, Divider, H1, Label, Screen, Button } from './src/ui';
import { theme } from './src/theme';

const qc = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <Screen>
        <ScrollView contentContainerStyle={{ gap: theme.spacing.lg, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
          <H1>Bugün</H1>

          <Card>
            <View style={{ gap: 6 }}>
              <Text style={{ color: theme.colors.text, fontSize: theme.typo.h2, fontWeight: '900' }}>Ödenecekler</Text>
              <Label>Bu hafta takip edilmesi gereken faturalar.</Label>
            </View>

            <Divider />

            <Text style={{ color: theme.colors.text, fontSize: 16, lineHeight: 22 }}>
              MVP hedefi: Müşteriler, faturalar, vade tarihi ve “takip mesajı” şablonları.
            </Text>

            <View style={{ height: 6 }} />
            <Button title="Yeni Fatura" onPress={() => {}} />
            <Button title="Takip Listesi" onPress={() => {}} variant="secondary" />
          </Card>
        </ScrollView>
      </Screen>
    </QueryClientProvider>
  );
}
