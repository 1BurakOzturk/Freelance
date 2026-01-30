import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { theme } from './theme';

export function Screen(props: { children: React.ReactNode }) {
  return <View style={[styles.screen]}>{props.children}</View>;
}

export function Card(props: { children: React.ReactNode; style?: any }) {
  return <View style={[styles.card, props.style]}>{props.children}</View>;
}

export function H1(props: { children: React.ReactNode }) {
  return <Text style={styles.h1}>{props.children}</Text>;
}

export function Label(props: { children: React.ReactNode }) {
  return <Text style={styles.label}>{props.children}</Text>;
}

export function Input(props: TextInputProps) {
  return <TextInput {...props} placeholderTextColor={theme.colors.muted} style={[styles.input, props.style]} />;
}

export function Button(props: { title: string; onPress: () => void; disabled?: boolean; variant?: 'primary' | 'secondary' }) {
  const variant = props.variant ?? 'primary';
  const bg = variant === 'primary' ? (props.disabled ? 'rgba(124,58,237,0.35)' : theme.colors.primary) : theme.colors.card;
  const border = variant === 'secondary' ? theme.colors.border : 'transparent';
  const color = variant === 'secondary' ? theme.colors.text : theme.colors.primaryText;

  return (
    <Pressable
      onPress={props.onPress}
      disabled={props.disabled}
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: bg,
          borderColor: border,
          borderWidth: variant === 'secondary' ? StyleSheet.hairlineWidth : 0,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      <Text style={[styles.btnText, { color }]}>{props.title}</Text>
    </Pressable>
  );
}

export function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 20, backgroundColor: theme.colors.bg },
  card: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  h1: { color: theme.colors.text, fontSize: theme.typo.h1, fontWeight: '900' },
  label: { color: theme.colors.muted, fontSize: theme.typo.small },
  input: {
    backgroundColor: '#0E1527',
    borderColor: theme.colors.border,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    color: theme.colors.text,
  },
  btn: {
    borderRadius: theme.radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnText: { fontWeight: '900' },
  divider: { height: 1, backgroundColor: theme.colors.border, opacity: 0.6, marginVertical: theme.spacing.sm },
});
