import React from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { clientsApi, invoicesApi } from '../api';
import { Button, Card, H1, Input, Label, Screen } from '../ui';
import { theme } from '../theme';

export function NewInvoiceScreen(props: { onDone: () => void }) {
  const qc = useQueryClient();
  const clientsQ = useQuery({ queryKey: ['clients'], queryFn: clientsApi.list });

  const [clientId, setClientId] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [currency, setCurrency] = React.useState('TRY');
  const [dueDate, setDueDate] = React.useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString();
  });

  const createM = useMutation({
    mutationFn: async () => {
      const amountCents = Math.round(Number(amount.replace(',', '.')) * 100);
      return invoicesApi.create({
        clientId,
        title: title.trim(),
        amountCents: Number.isFinite(amountCents) ? amountCents : 0,
        currency: currency.trim().toUpperCase(),
        dueDate,
      });
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['invoices'] });
      props.onDone();
    },
    onError: (e: any) => Alert.alert('Hata', String(e?.response?.data?.error ?? e?.message ?? 'unknown_error')),
  });

  const clients = clientsQ.data ?? [];

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: theme.spacing.lg, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <H1>Yeni Fatura</H1>

        <Card>
          <Label>Müşteri</Label>
          <Text style={{ color: theme.colors.muted, fontSize: 13 }}>
            Şimdilik en basit seçim: ilk müşteri id. (UI selection iyileştirmesi sırada)
          </Text>
          <Button
            title={clients.length ? `Seç: ${clients.find((c) => c.id === clientId)?.name ?? clients[0].name}` : 'Önce müşteri ekle'}
            variant="secondary"
            onPress={() => {
              if (!clients.length) return;
              const next = clientId ? clients[(clients.findIndex((c) => c.id === clientId) + 1) % clients.length].id : clients[0].id;
              setClientId(next);
            }}
          />

          <Label>Başlık</Label>
          <Input placeholder="Örn: Mobil uygulama" value={title} onChangeText={setTitle} />

          <Label>Tutar</Label>
          <Input placeholder="Örn: 1500" keyboardType="numeric" value={amount} onChangeText={setAmount} />

          <Label>Para birimi</Label>
          <Input placeholder="TRY" autoCapitalize="characters" value={currency} onChangeText={setCurrency} />

          <Label>Vade (ISO)</Label>
          <Input value={dueDate} onChangeText={setDueDate} />

          <Button
            title={createM.isPending ? 'Kaydediliyor…' : 'Kaydet'}
            onPress={() => {
              const effectiveClientId = clientId || clients[0]?.id || '';
              if (!effectiveClientId) return Alert.alert('Müşteri yok', 'Önce müşteri eklemelisin.');
              setClientId(effectiveClientId);
              if (title.trim().length < 1) return Alert.alert('Eksik', 'Başlık gerekli.');
              createM.mutate();
            }}
            disabled={createM.isPending}
          />

          <Button title="Vazgeç" variant="secondary" onPress={props.onDone} />
        </Card>
      </ScrollView>
    </Screen>
  );
}
