import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { Invoice, invoicesApi } from '../api';
import { Button, Card, Divider, H1, Label, Screen } from '../ui';
import { theme } from '../theme';

function fmtMoney(amountCents: number, currency: string) {
  const amount = amountCents / 100;
  try {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

export function InvoicesScreen(props: { onNewInvoice: () => void; onOpenInvoice: (id: string) => void }) {
  const q = useQuery({ queryKey: ['invoices'], queryFn: invoicesApi.list });
  const items: Invoice[] = q.data ?? [];

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: theme.spacing.lg, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <H1>Faturalar</H1>
          <Button title="+" onPress={props.onNewInvoice} variant="secondary" />
        </View>

        <Card>
          <View style={{ gap: 6 }}>
            <Text style={{ color: theme.colors.text, fontSize: theme.typo.h2, fontWeight: '900' }}>Liste</Text>
            <Label>{q.isLoading ? 'Yükleniyor…' : `${items.length} fatura`}</Label>
          </View>

          <Divider />

          {items.length === 0 ? (
            <Text style={{ color: theme.colors.text, fontSize: 15, lineHeight: 22 }}>Henüz fatura yok.</Text>
          ) : (
            <View style={{ gap: theme.spacing.md }}>
              {items.map((inv) => (
                <View key={inv.id} style={{ gap: 8 }}>
                  <View style={{ gap: 2 }}>
                    <Text style={{ color: theme.colors.text, fontWeight: '900' }}>{inv.title}</Text>
                    <Label>
                      {inv.client?.name ?? '—'} · {fmtMoney(inv.amountCents, inv.currency)} · {inv.status} · vade: {new Date(inv.dueDate).toLocaleDateString('tr-TR')}
                    </Label>
                  </View>
                  <Button title="Detay" variant="secondary" onPress={() => props.onOpenInvoice(inv.id)} />
                </View>
              ))}
            </View>
          )}

          <View style={{ height: 6 }} />
          <Button title="Yeni Fatura" onPress={props.onNewInvoice} />
        </Card>
      </ScrollView>
    </Screen>
  );
}
