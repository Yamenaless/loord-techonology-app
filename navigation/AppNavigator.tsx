import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../data/theme';
import { useAuth } from '../contexts/AuthContext';

// Import your screens here
import HomeScreen from '../screens/HomeScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Categories') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: theme.colors.textSecondary,
            tabBarStyle: {
              backgroundColor: theme.colors.white,
              borderTopColor: theme.colors.borderLight,
              ...theme.shadows.lg,
            },
            headerStyle: {
              backgroundColor: theme.colors.white,
              borderBottomColor: theme.colors.borderLight,
              ...theme.shadows.sm,
            },
            headerTintColor: theme.colors.text,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="Categories" 
        component={ProductListScreen}
        options={{ title: 'Categories' }}
      />
      <Tab.Screen 
        name="Cart" 
        component={CartScreen}
        options={{ title: 'Cart' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // You could show a loading screen here
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.white,
            borderBottomColor: theme.colors.borderLight,
            ...theme.shadows.sm,
          },
          headerTintColor: theme.colors.text,
        }}
      >
        {isAuthenticated ? (
          // Authenticated user screens
          <>
            <Stack.Screen 
              name="Main" 
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="ProductList" 
              component={ProductListScreen}
              options={{ title: 'Products' }}
            />
            <Stack.Screen 
              name="ProductDetails" 
              component={ProductDetailsScreen}
              options={{ title: 'Product Details' }}
            />
            <Stack.Screen 
              name="Cart" 
              component={CartScreen}
              options={{ title: 'Shopping Cart' }}
            />
            <Stack.Screen 
              name="Checkout" 
              component={CheckoutScreen}
              options={{ title: 'Checkout' }}
            />
          </>
        ) : (
          // Authentication screens for unauthenticated users
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{ 
                headerShown: false,
                gestureEnabled: false,
              }}
            />
            <Stack.Screen 
              name="Signup" 
              component={SignupScreen}
              options={{ 
                headerShown: false,
                gestureEnabled: false,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
