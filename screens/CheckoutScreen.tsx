import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../data/theme';
import { userProfile } from '../data/dummyData';

export default function CheckoutScreen() {
  const navigation = useNavigation();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    firstName: userProfile.name.split(' ')[0] || '',
    lastName: userProfile.name.split(' ')[1] || '',
    email: userProfile.email,
    phone: userProfile.phone,
    address: userProfile.address.street,
    city: userProfile.address.city,
    state: userProfile.address.state,
    zipCode: userProfile.address.zipCode,
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = () => {
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    // Create order summary message
    const orderSummary = `
🛒 *New Order from LoordTechnology*

👤 *Customer Details:*
Name: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Phone: ${formData.phone}

📍 *Shipping Address:*
${formData.address}
${formData.city}, ${formData.state} ${formData.zipCode}

💳 *Payment Method:* ${selectedPaymentMethod === 'card' ? 'Credit Card' : 'Cash on Delivery'}

📦 *Order Total:* $1,240.92

Please confirm this order and provide shipping details.
    `.trim();

    // Open WhatsApp with the order details
    const whatsappUrl = `whatsapp://send?phone=905383391090&text=${encodeURIComponent(orderSummary)}`;
    
    Linking.canOpenURL(whatsappUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(whatsappUrl);
        } else {
          // Fallback to web WhatsApp if app is not installed
          const webWhatsappUrl = `https://wa.me/905383391090?text=${encodeURIComponent(orderSummary)}`;
          return Linking.openURL(webWhatsappUrl);
        }
      })
      .catch((err) => {
        Alert.alert('Error', 'Could not open WhatsApp. Please try again.');
        console.error('Error opening WhatsApp:', err);
      });
  };

  const formatCardNumber = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    // Add spaces every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted;
  };

  const formatExpiryDate = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    // Add slash after 2 digits
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const renderPaymentMethod = (method: string, title: string, icon: string) => (
    <TouchableOpacity
      style={[
        styles.paymentMethod,
        selectedPaymentMethod === method && styles.selectedPaymentMethod
      ]}
      onPress={() => setSelectedPaymentMethod(method)}
    >
      <View style={styles.paymentMethodContent}>
        <Ionicons 
          name={icon as any} 
          size={24} 
          color={selectedPaymentMethod === method ? theme.colors.primary : theme.colors.text} 
        />
        <Text style={[
          styles.paymentMethodText,
          selectedPaymentMethod === method && styles.selectedPaymentMethodText
        ]}>
          {title}
        </Text>
      </View>
      {selectedPaymentMethod === method && (
        <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Shipping Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Information</Text>
          
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>First Name *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.firstName}
                onChangeText={(text) => handleInputChange('firstName', text)}
                placeholder="Enter first name"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Last Name *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.lastName}
                onChangeText={(text) => handleInputChange('lastName', text)}
                placeholder="Enter last name"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              placeholder="Enter email"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone</Text>
            <TextInput
              style={styles.textInput}
              value={formData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
              placeholder="Enter phone number"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Address *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.address}
              onChangeText={(text) => handleInputChange('address', text)}
              placeholder="Enter street address"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>City *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.city}
                onChangeText={(text) => handleInputChange('city', text)}
                placeholder="Enter city"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>State *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.state}
                onChangeText={(text) => handleInputChange('state', text)}
                placeholder="Enter state"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>ZIP Code *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.zipCode}
              onChangeText={(text) => handleInputChange('zipCode', text)}
              placeholder="Enter ZIP code"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          {renderPaymentMethod('card', 'Credit/Debit Card', 'card')}
          {renderPaymentMethod('paypal', 'PayPal', 'logo-paypal')}
          {renderPaymentMethod('apple', 'Apple Pay', 'logo-apple')}
        </View>

        {/* Card Details */}
        {selectedPaymentMethod === 'card' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Card Details</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Card Number *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.cardNumber}
                onChangeText={(text) => handleInputChange('cardNumber', formatCardNumber(text))}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="numeric"
                maxLength={19}
              />
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Expiry Date *</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.expiryDate}
                  onChangeText={(text) => handleInputChange('expiryDate', formatExpiryDate(text))}
                  placeholder="MM/YY"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>CVV *</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.cvv}
                  onChangeText={(text) => handleInputChange('cvv', text)}
                  placeholder="123"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Cardholder Name *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.cardName}
                onChangeText={(text) => handleInputChange('cardName', text)}
                placeholder="Enter cardholder name"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
          </View>
        )}

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>$1,149.00</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>Free</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>$91.92</Text>
          </View>
          
          <View style={[styles.summaryItem, styles.totalItem]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>$1,240.92</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
          <Text style={styles.placeOrderText}>Proceed to WhatsApp</Text>
          <Ionicons name="logo-whatsapp" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  headerTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    flex: 1,
    marginBottom: theme.spacing.md,
    marginRight: theme.spacing.sm,
  },
  inputLabel: {
    ...theme.typography.caption,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  textInput: {
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.typography.body,
    color: theme.colors.text,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedPaymentMethod: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.background,
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodText: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    fontWeight: '500',
  },
  selectedPaymentMethodText: {
    color: theme.colors.primary,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  totalItem: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  summaryLabel: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  summaryValue: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
  totalLabel: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  totalValue: {
    ...theme.typography.h3,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  bottomContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  placeOrderButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  placeOrderText: {
    ...theme.typography.body,
    color: 'white',
    fontWeight: 'bold',
    marginRight: theme.spacing.sm,
  },
});

