import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { AuthScreen } from './screens/AuthScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { ClientsScreen } from './screens/ClientsScreen';
import { InvoicesScreen } from './screens/InvoicesScreen';
import { NewInvoiceScreen } from './screens/NewInvoiceScreen';
import { InvoiceDetailScreen } from './screens/InvoiceDetailScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { theme } from './theme';
import { invoicesApi } from './api';
import { Button, Card, H1, Label, Screen } from './ui';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  NewInvoice: undefined;
  InvoiceDetail: { invoiceId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MainTabs(props: { onNewInvoice: () => void; onOpenInvoice: (id: string) => void; onLogout: () => void }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: theme.colors.card, borderTopColor: theme.colors.border },
        tabBarActiveTintColor: theme.colors.text,
        tabBarInactiveTintColor: theme.colors.muted,
      }}
    >
      <Tab.Screen name="Bugün" children={() => <DashboardScreen onNewInvoice={props.onNewInvoice} />} />
      <Tab.Screen name="Faturalar" children={() => <InvoicesScreen onNewInvoice={props.onNewInvoice} onOpenInvoice={props.onOpenInvoice} />} />
      <Tab.Screen name="Müşteriler" component={ClientsScreen} />
      <Tab.Screen name="Ayarlar" children={() => <SettingsScreen onLogout={props.onLogout} />} />
    </Tab.Navigator>
  );
}

export function AppNavigator(props: { isAuthed: boolean; onAuthed: () => void; onLogout: () => void }) {
  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: theme.colors.bg,
          card: theme.colors.card,
          text: theme.colors.text,
          border: theme.colors.border,
          primary: theme.colors.primary,
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.bg },
        }}
      >
        {!props.isAuthed ? (
          <Stack.Screen name="Auth">
            {() => <AuthScreen onAuthed={props.onAuthed} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Main">
              {({ navigation }) => (
                <MainTabs
                  onNewInvoice={() => navigation.navigate('NewInvoice')}
                  onOpenInvoice={(id) => navigation.navigate('InvoiceDetail', { invoiceId: id })}
                  onLogout={() => {
                    props.onLogout();
                    navigation.reset({ index: 0, routes: [{ name: 'Auth' as any }] });
                  }}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="NewInvoice">
              {({ navigation }) => <NewInvoiceScreen onDone={() => navigation.goBack()} />}
            </Stack.Screen>
            <Stack.Screen name="InvoiceDetail">
              {({ navigation, route }) => (
                <InvoiceDetailResolver invoiceId={(route.params as any).invoiceId} onBack={() => navigation.goBack()} />
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/* duplicate imports removed */

function InvoiceDetailResolver(props: { invoiceId: string; onBack: () => void }) {
  const q = useQuery({ queryKey: ['invoices'], queryFn: invoicesApi.list });
  const items = q.data ?? [];
  const invoice = items.find((i) => i.id === props.invoiceId);
  if (!invoice) {
    return (
      <Screen>
        <ScrollView contentContainerStyle={{ gap: theme.spacing.lg, paddingBottom: 24 }}>
          <H1>Fatura</H1>
          <Card>
            <Label>Bulunamadı</Label>
            <Button title="Geri" variant="secondary" onPress={props.onBack} />
          </Card>
        </ScrollView>
      </Screen>
    );
  }
  return <InvoiceDetailScreen invoice={invoice} onBack={props.onBack} />;
}
