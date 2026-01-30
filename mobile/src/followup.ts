import type { Invoice } from './api';

function daysBetween(a: Date, b: Date) {
  const ms = b.getTime() - a.getTime();
  return Math.floor(ms / (24 * 60 * 60 * 1000));
}

export type FollowUpTone = 'soft' | 'normal' | 'firm';

export function buildFollowUpMessage(inv: Invoice, tone: FollowUpTone = 'normal') {
  const client = inv.client?.name ?? 'Merhaba';
  const amount = (inv.amountCents / 100).toFixed(2).replace('.', ',');
  const currency = inv.currency;

  const due = new Date(inv.dueDate);
  const now = new Date();
  const overdueDays = daysBetween(due, now);

  const dueText = due.toLocaleDateString('tr-TR');

  const opener =
    tone === 'soft'
      ? `Merhaba ${client}, umarım her şey yolundadır.`
      : tone === 'firm'
        ? `Merhaba ${client},` 
        : `Merhaba ${client},`;

  const body =
    overdueDays <= 0
      ? `“${inv.title}” işi için düzenlenen faturanın vadesi ${dueText}. Tutar: ${amount} ${currency}.`
      : `“${inv.title}” işi için düzenlenen faturanın vadesi ${dueText} idi (gecikme: ${overdueDays} gün). Tutar: ${amount} ${currency}.`;

  const ask =
    tone === 'soft'
      ? 'Uygunsa ödeme durumunu paylaşabilir misiniz?'
      : tone === 'firm'
        ? 'Ödeme durumunu ve netleşen ödeme tarihini bugün içinde paylaşmanızı rica ederim.'
        : 'Ödeme durumunu ve planlanan ödeme tarihini paylaşabilir misiniz?';

  const close =
    tone === 'soft'
      ? 'Teşekkürler, iyi günler.'
      : tone === 'firm'
        ? 'Teşekkürler.'
        : 'Teşekkürler.';

  return `${opener}\n\n${body}\n${ask}\n\n${close}`;
}
