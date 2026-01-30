import React from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import type { Client } from '../api';
import { Card, Input, Label, Button } from '../ui';
import { theme } from '../theme';

export function ClientPicker(props: {
  visible: boolean;
  clients: Client[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const [q, setQ] = React.useState('');

  React.useEffect(() => {
    if (!props.visible) setQ('');
  }, [props.visible]);

  const items = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return props.clients;
    return props.clients.filter((c) => {
      const hay = `${c.name} ${c.email ?? ''} ${c.company ?? ''}`.toLowerCase();
      return hay.includes(s);
    });
  }, [q, props.clients]);

  return (
    <Modal visible={props.visible} transparent animationType="fade" onRequestClose={props.onClose}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', padding: 18 }} onPress={props.onClose}>
        <Pressable onPress={() => {}} style={{ marginTop: 80 }}>
          <Card>
            <View style={{ gap: 6 }}>
              <Text style={{ color: theme.colors.text, fontSize: 18, fontWeight: '900' }}>Müşteri seç</Text>
              <Label>İsim veya e-posta ile ara</Label>
            </View>

            <Input placeholder="Ara…" value={q} onChangeText={setQ} autoCapitalize="none" />

            <ScrollView style={{ maxHeight: 360 }} showsVerticalScrollIndicator={false}>
              <View style={{ gap: theme.spacing.sm }}>
                {items.length === 0 ? (
                  <Text style={{ color: theme.colors.text, paddingVertical: 8 }}>Sonuç yok.</Text>
                ) : (
                  items.map((c) => {
                    const active = c.id === props.selectedId;
                    return (
                      <Pressable
                        key={c.id}
                        onPress={() => {
                          props.onSelect(c.id);
                          props.onClose();
                        }}
                        style={({ pressed }) => ({
                          paddingVertical: 12,
                          paddingHorizontal: 12,
                          borderRadius: theme.radius.md,
                          borderWidth: 1,
                          borderColor: active ? theme.colors.primary : theme.colors.border,
                          backgroundColor: active ? 'rgba(124,58,237,0.12)' : '#0E1527',
                          opacity: pressed ? 0.92 : 1,
                        })}
                      >
                        <Text style={{ color: theme.colors.text, fontWeight: '900' }}>{c.name}</Text>
                        <Text style={{ color: theme.colors.muted, marginTop: 2 }}>{c.email ?? ''}</Text>
                      </Pressable>
                    );
                  })
                )}
              </View>
            </ScrollView>

            <Button title="Kapat" variant="secondary" onPress={props.onClose} />
          </Card>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
