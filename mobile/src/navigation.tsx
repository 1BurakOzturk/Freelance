import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { AuthScreen } from './screens/AuthScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { ClientsScreen } from './screens/ClientsScreen';
import { InvoicesScreen } from './screens/InvoicesScreen';
import { NewInvoiceScreen } from './screens/NewInvoiceScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { theme } from './theme';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  NewInvoice: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MainTabs(props: { onNewInvoice: () => void; onLogout: () => void }) {
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
      <Tab.Screen name="Faturalar" children={() => <InvoicesScreen onNewInvoice={props.onNewInvoice} />} />
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
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
