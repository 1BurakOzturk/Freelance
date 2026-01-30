import React from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { Invoice, InvoiceStatus } from '../api';
import { invoicesApi } from '../api';
import { buildFollowUpMessage, type FollowUpTone } from '../followup';
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

const statusOrder: InvoiceStatus[] = ['DRAFT', 'SENT', 'OVERDUE', 'PARTIALLY_PAID', 'PAID'];

function nextStatus(s: InvoiceStatus): InvoiceStatus {
  const i = statusOrder.indexOf(s);
  return statusOrder[(i + 1) % statusOrder.length];
}

export function InvoiceDetailScreen(props: { invoice: Invoice; onBack: () => void }) {
  const qc = useQueryClient();

  const [tone, setTone] = React.useState<FollowUpTone>('normal');
  const [preview, setPreview] = React.useState<string>(() => buildFollowUpMessage(props.invoice, 'normal'));

  React.useEffect(() => {
    setPreview(buildFollowUpMessage(props.invoice, tone));
  }, [props.invoice, tone]);

  const m = useMutation({
    mutationFn: async (patch: Partial<Pick<Invoice, 'status' | 'paidAt'>>) => {
      return invoicesApi.update(props.invoice.id, patch);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['invoices'] });
    },
    onError: (e: any) => Alert.alert('Hata', String(e?.response?.data?.error ?? e?.message ?? 'unknown_error')),
  });

  const inv = props.invoice;
  const isPaid = inv.status === 'PAID';

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: theme.spacing.lg, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <H1>Fatura</H1>

        <Card>
          <Text style={{ color: theme.colors.text, fontSize: theme.typo.h2, fontWeight: '900' }}>{inv.title}</Text>
          <Label>{inv.client?.name ?? inv.clientId}</Label>
          <Divider />
          <Label>Tutar</Label>
          <Text style={{ color: theme.colors.text, fontSize: 18, fontWeight: '900' }}>{fmtMoney(inv.amountCents, inv.currency)}</Text>

          <Label>Vade</Label>
          <Text style={{ color: theme.colors.text }}>{new Date(inv.dueDate).toLocaleString('tr-TR')}</Text>

          <Label>Durum</Label>
          <Text style={{ color: theme.colors.text, fontWeight: '800' }}>{inv.status}</Text>

          <View style={{ height: 6 }} />

          <Button
            title={m.isPending ? 'Güncelleniyor…' : `Durum değiştir → ${nextStatus(inv.status)}`}
            onPress={() => m.mutate({ status: nextStatus(inv.status) })}
            disabled={m.isPending}
          />

          <Button
            title={m.isPending ? 'Bekle…' : isPaid ? 'Ödenmedi yap' : 'Ödendi yap'}
            variant="secondary"
            onPress={() => m.mutate({ status: isPaid ? 'SENT' : 'PAID', paidAt: isPaid ? null : new Date().toISOString() })}
            disabled={m.isPending}
          />

          <Divider />

          <Label>Takip mesajı</Label>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Button title={tone === 'soft' ? '✓ Yumuşak' : 'Yumuşak'} variant="secondary" onPress={() => setTone('soft')} />
            <Button title={tone === 'normal' ? '✓ Normal' : 'Normal'} variant="secondary" onPress={() => setTone('normal')} />
            <Button title={tone === 'firm' ? '✓ Sert' : 'Sert'} variant="secondary" onPress={() => setTone('firm')} />
          </View>

          <Card style={{ backgroundColor: '#0E1527' }}>
            <Text style={{ color: theme.colors.text, fontSize: 14, lineHeight: 20 }}>{preview}</Text>
          </Card>

          <Button
            title="Kopyala"
            onPress={async () => {
              await Clipboard.setStringAsync(preview);
              Alert.alert('Kopyalandı', 'Takip mesajı panoya kopyalandı.');
            }}
          />

          <Button title="Geri" variant="secondary" onPress={props.onBack} />
        </Card>
      </ScrollView>
    </Screen>
  );
}
