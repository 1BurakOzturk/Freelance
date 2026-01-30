import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { invoicesApi } from '../api';
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

export function DashboardScreen(props: { onNewInvoice: () => void }) {
  const q = useQuery({ queryKey: ['invoices'], queryFn: invoicesApi.list });

  const items = q.data ?? [];
  const openItems = items.filter((i) => i.status !== 'PAID');
  const dueSoon = openItems
    .slice()
    .sort((a, b) => +new Date(a.dueDate) - +new Date(b.dueDate))
    .slice(0, 3);

  const totalOpenCents = openItems.reduce((acc, i) => acc + i.amountCents, 0);
  const overdueCount = openItems.filter((i) => new Date(i.dueDate).getTime() < Date.now()).length;

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: theme.spacing.lg, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <H1>Bugün</H1>

        <Card>
          <View style={{ gap: 6 }}>
            <Text style={{ color: theme.colors.text, fontSize: theme.typo.h2, fontWeight: '900' }}>Özet</Text>
            <Label>{q.isLoading ? 'Yükleniyor…' : `${items.length} fatura`}</Label>
          </View>

          <Divider />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ gap: 2 }}>
              <Label>Toplam alacak</Label>
              <Text style={{ color: theme.colors.text, fontWeight: '900', fontSize: 18 }}>{fmtMoney(totalOpenCents, 'TRY')}</Text>
            </View>
            <View style={{ gap: 2, alignItems: 'flex-end' }}>
              <Label>Geciken</Label>
              <Text style={{ color: theme.colors.text, fontWeight: '900', fontSize: 18 }}>{overdueCount}</Text>
            </View>
          </View>

          <View style={{ height: 6 }} />
          <Button title="Yeni Fatura" onPress={props.onNewInvoice} />
        </Card>

        <Card>
          <View style={{ gap: 6 }}>
            <Text style={{ color: theme.colors.text, fontSize: theme.typo.h2, fontWeight: '900' }}>Yaklaşan Vadeler</Text>
            <Label>{q.isLoading ? 'Yükleniyor…' : `${openItems.length} açık fatura`}</Label>
          </View>

          <Divider />

          {dueSoon.length === 0 ? (
            <Text style={{ color: theme.colors.text, fontSize: 15, lineHeight: 22 }}>
              Henüz takip edilecek fatura yok. İlk faturayı ekleyip vade takibini başlat.
            </Text>
          ) : (
            <View style={{ gap: theme.spacing.sm }}>
              {dueSoon.map((inv) => (
                <View key={inv.id} style={{ gap: 2 }}>
                  <Text style={{ color: theme.colors.text, fontWeight: '800' }}>{inv.title}</Text>
                  <Label>
                    {inv.client?.name ?? '—'} · {fmtMoney(inv.amountCents, inv.currency)} · vade: {new Date(inv.dueDate).toLocaleDateString('tr-TR')}
                  </Label>
                </View>
              ))}
            </View>
          )}
        </Card>
      </ScrollView>
    </Screen>
  );
}
