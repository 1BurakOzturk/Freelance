import React from 'react';
import { Alert, View } from 'react-native';
import { useMutation } from '@tanstack/react-query';

import { authApi } from '../api';
import { Button, Card, H1, Input, Label, Screen } from '../ui';
import { theme } from '../theme';
import { setToken } from '../authStore';

export function AuthScreen(props: { onAuthed: () => void }) {
  const [mode, setMode] = React.useState<'login' | 'register'>('login');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const m = useMutation({
    mutationFn: async () => {
      if (mode === 'login') return authApi.login(email.trim(), password);
      return authApi.register(email.trim(), password);
    },
    onSuccess: async (data) => {
      await setToken(data.token);
      props.onAuthed();
    },
    onError: (e: any) => {
      const msg = e?.response?.data?.error ?? e?.message ?? 'unknown_error';
      Alert.alert('Hata', String(msg));
    },
  });

  return (
    <Screen>
      <View style={{ gap: theme.spacing.lg, paddingTop: 12 }}>
        <H1>PayPrompt</H1>
        <Card>
          <Label>{mode === 'login' ? 'Giriş yap' : 'Hesap oluştur'}</Label>
          <Input placeholder="E-posta" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
          <Input placeholder="Şifre (min 8)" secureTextEntry value={password} onChangeText={setPassword} />

          <Button
            title={m.isPending ? 'Bekle…' : mode === 'login' ? 'Giriş' : 'Kayıt Ol'}
            onPress={() => m.mutate()}
            disabled={m.isPending || email.trim().length < 3 || password.length < 8}
          />
          <Button
            title={mode === 'login' ? 'Hesap oluştur' : 'Zaten hesabım var'}
            onPress={() => setMode(mode === 'login' ? 'register' : 'login')}
            variant="secondary"
          />
        </Card>
      </View>
    </Screen>
  );
}
