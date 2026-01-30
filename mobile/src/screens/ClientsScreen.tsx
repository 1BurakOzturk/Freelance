import React from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Client, clientsApi } from '../api';
import { Button, Card, Divider, H1, Input, Label, Screen } from '../ui';
import { theme } from '../theme';

export function ClientsScreen() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ['clients'], queryFn: clientsApi.list });

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');

  const createM = useMutation({
    mutationFn: () => clientsApi.create({ name: name.trim(), email: email.trim() || undefined }),
    onSuccess: async () => {
      setName('');
      setEmail('');
      await qc.invalidateQueries({ queryKey: ['clients'] });
    },
    onError: (e: any) => Alert.alert('Hata', String(e?.response?.data?.error ?? e?.message ?? 'unknown_error')),
  });

  const delM = useMutation({
    mutationFn: (id: string) => clientsApi.remove(id),
    onSuccess: async () => qc.invalidateQueries({ queryKey: ['clients'] }),
    onError: (e: any) => Alert.alert('Hata', String(e?.response?.data?.error ?? e?.message ?? 'unknown_error')),
  });

  const items: Client[] = q.data ?? [];

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: theme.spacing.lg, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <H1>Müşteriler</H1>

        <Card>
          <Label>Yeni müşteri</Label>
          <Input placeholder="İsim" value={name} onChangeText={setName} />
          <Input placeholder="E-posta (opsiyonel)" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
          <Button title={createM.isPending ? 'Ekleniyor…' : 'Ekle'} onPress={() => createM.mutate()} disabled={createM.isPending || name.trim().length < 1} />
        </Card>

        <Card>
          <View style={{ gap: 6 }}>
            <Text style={{ color: theme.colors.text, fontSize: theme.typo.h2, fontWeight: '900' }}>Liste</Text>
            <Label>{q.isLoading ? 'Yükleniyor…' : `${items.length} müşteri`}</Label>
          </View>

          <Divider />

          {items.length === 0 ? (
            <Text style={{ color: theme.colors.text, fontSize: 15, lineHeight: 22 }}>Henüz müşteri yok.</Text>
          ) : (
            <View style={{ gap: theme.spacing.md }}>
              {items.map((c) => (
                <View key={c.id} style={{ gap: 6 }}>
                  <View style={{ gap: 2 }}>
                    <Text style={{ color: theme.colors.text, fontWeight: '800' }}>{c.name}</Text>
                    <Label>{c.email ?? ''}</Label>
                  </View>
                  <Button
                    title={delM.isPending ? 'Siliniyor…' : 'Sil'}
                    variant="secondary"
                    onPress={() =>
                      Alert.alert('Silinsin mi?', c.name, [
                        { text: 'Vazgeç', style: 'cancel' },
                        { text: 'Sil', style: 'destructive', onPress: () => delM.mutate(c.id) },
                      ])
                    }
                  />
                </View>
              ))}
            </View>
          )}
        </Card>
      </ScrollView>
    </Screen>
  );
}
