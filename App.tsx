import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { theme } from './data/theme';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AppNavigator />
          <StatusBar style="light" backgroundColor={theme.colors.background} />
        </GestureHandlerRootView>
      </CartProvider>
    </AuthProvider>
  );
}
