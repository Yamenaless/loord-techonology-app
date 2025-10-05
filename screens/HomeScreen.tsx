import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  FlatList,
  Dimensions,
  TextInput,
  Modal,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { theme } from '../data/theme';
import { categories, products, banners, testimonials, contactInfo } from '../data/dummyData';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchHistory, setSearchHistory] = useState([
    'RTX 4090',
    'Gaming Mouse',
    'Mechanical Keyboard',
    'Gaming Headset',
    'SSD 1TB'
  ]);

  const handleExploreApp = () => {
    // Navigate to Profile screen
    navigation.navigate('Profile' as never);
  };

  const handleShowAlert = () => {
    Alert.alert(
      'Customer Support',
      'Need help with your PC build? Our expert technicians are here to assist you with component compatibility, installation guidance, and troubleshooting.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Contact Support', onPress: () => console.log('Support contacted') },
      ]
    );
  };

  const handleViewFeatures = () => {
    Alert.alert(
      'PC Builder Tool',
      'Build your dream PC with our compatibility checker:\n• Component compatibility validation\n• Power consumption calculator\n• Performance benchmarking\n• Price optimization suggestions',
      [{ text: 'Start Building' }]
    );
  };

  const handleCategoryPress = (category: any) => {
    (navigation as any).navigate('ProductList', { category });
  };

  const handleProductPress = (product: any) => {
    (navigation as any).navigate('ProductDetails', { product });
  };

  const handleContactUs = () => {
    Alert.alert(
      'Contact Us',
      'Phone: +1 (555) 123-4567\nEmail: support@loordtechnology.com\n\nWe\'re here to help!',
      [{ text: 'OK' }]
    );
  };

  const handleSearchPress = () => {
    setShowSearchModal(true);
  };

  const handleSearchSubmit = (query: string) => {
    if (query.trim()) {
      // Add to search history if not already present
      if (!searchHistory.includes(query)) {
        setSearchHistory([query, ...searchHistory.slice(0, 4)]);
      }
      setSearchQuery(query);
      setShowSearchModal(false);
      // Navigate to product list with search query
      (navigation as any).navigate('ProductList', { searchQuery: query });
    }
  };

  const handleSearchHistoryPress = (query: string) => {
    setSearchQuery(query);
    setShowSearchModal(false);
    (navigation as any).navigate('ProductList', { searchQuery: query });
  };


  const renderCategory = ({ item }: { item: any }) => (
    <View style={styles.categoryCard}>
      <Image source={{ uri: item.image }} style={styles.categoryImage} />
      <View style={styles.categoryContent}>
        <Text style={styles.categoryTitle}>{item.name}</Text>
        <View style={styles.subcategoriesList}>
          {item.subcategories.map((subcategory: string, index: number) => (
            <TouchableOpacity
              key={index}
              style={styles.subcategoryItem}
              onPress={() => handleCategoryPress({ name: subcategory })}
            >
              <Text style={styles.subcategoryText}>{subcategory}</Text>
              <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderProduct = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.productCard} 
      onPress={() => handleProductPress(item)}
    >
      <Image source={{ uri: item.images[0] }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.productPriceContainer}>
          <Text style={styles.productPrice}>${item.price}</Text>
          {item.originalPrice && (
            <Text style={styles.originalPrice}>${item.originalPrice}</Text>
          )}
        </View>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={12} color="#FFD700" />
          <Text style={styles.rating}>{item.rating}</Text>
          <Text style={styles.reviewCount}>({item.reviewCount})</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderTestimonial = ({ item }: { item: any }) => (
    <View style={styles.testimonialCard}>
      <View style={styles.testimonialHeader}>
        <Image source={{ uri: item.avatar }} style={styles.testimonialAvatar} />
        <View style={styles.testimonialInfo}>
          <Text style={styles.testimonialName}>{item.name}</Text>
          <Text style={styles.testimonialRole}>{item.role}</Text>
        </View>
      </View>
      <View style={styles.testimonialRating}>
        {[...Array(5)].map((_, index) => (
          <Ionicons
            key={index}
            name="star"
            size={16}
            color={index < item.rating ? theme.colors.warning : theme.colors.border}
          />
        ))}
      </View>
      <Text style={styles.testimonialComment}>"{item.comment}"</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('home.title')}</Text>
          <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
        </View>

        {/* Search Box */}
        <View style={styles.searchContainer}>
          <TouchableOpacity style={styles.searchBox} onPress={handleSearchPress}>
            <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
            <Text style={styles.searchPlaceholder}>
              {searchQuery || t('home.searchPlaceholder')}
            </Text>
            <Ionicons name="mic" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Professional Hero Section */}
        <View style={styles.heroSection}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop' }} 
            style={styles.heroBackground}
            resizeMode="cover"
          />
          <View style={styles.heroGradient} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Premium PC Components</Text>
            <Text style={styles.heroSubtitle}>Build your dream setup with the latest technology</Text>
            <TouchableOpacity style={styles.heroButton} onPress={() => (navigation as any).navigate('ProductList', {})}>
              <Text style={styles.heroButtonText}>Shop Now</Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <FlatList
            data={categories || []}
            renderItem={renderCategory}
            scrollEnabled={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            <TouchableOpacity onPress={() => (navigation as any).navigate('ProductList', {})}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={(products || []).filter(p => p.featured)}
            renderItem={renderProduct}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
          />
        </View>

        {/* Gaming Accessories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Gaming Accessories</Text>
            <TouchableOpacity onPress={() => (navigation as any).navigate('ProductList', {})}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={(products || []).filter(p => ['Mice', 'Headsets', 'Controllers', 'Mousepads'].includes(p.category))}
            renderItem={renderProduct}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
          />
        </View>

        {/* Best Sellers */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Best Sellers</Text>
            <TouchableOpacity onPress={() => (navigation as any).navigate('ProductList', {})}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={(products || []).filter(p => p.rating >= 4.7)}
            renderItem={renderProduct}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
          />
        </View>

        {/* Laptops */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Laptops & MacBooks</Text>
            <TouchableOpacity onPress={() => (navigation as any).navigate('ProductList', { category: { name: 'Laptops' } })}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={(products || []).filter(p => p.category === 'Laptops')}
            renderItem={renderProduct}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
          />
        </View>

        {/* New Arrivals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>New Arrivals</Text>
            <TouchableOpacity onPress={() => (navigation as any).navigate('ProductList', {})}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={(products || []).slice(0, 4)}
            renderItem={renderProduct}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
          />
        </View>

        {/* Why Choose Us */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="shield-checkmark" size={24} color={theme.colors.primary} />
            <Text style={styles.cardTitle}>Why Choose LoordTechnology</Text>
          </View>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
              <Text style={styles.featureText}>Genuine products with warranty</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
              <Text style={styles.featureText}>Expert technical support</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
              <Text style={styles.featureText}>Fast shipping & easy returns</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
              <Text style={styles.featureText}>Competitive pricing</Text>
            </View>
          </View>
        </View>


        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleShowAlert}>
            <Ionicons name="information-circle" size={20} color={theme.colors.primary} />
            <Text style={styles.secondaryButtonText}>Support</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleViewFeatures}>
            <Ionicons name="build" size={20} color={theme.colors.secondary} />
            <Text style={styles.secondaryButtonText}>PC Builder</Text>
          </TouchableOpacity>
        </View>

        {/* Customer Testimonials Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What Our Customers Say</Text>
          <FlatList
            data={testimonials || []}
            renderItem={renderTestimonial}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.testimonialsList}
          />
        </View>

        {/* Contact Us Section */}
        <View style={styles.contactSection}>
          <View style={styles.contactCard}>
            <Text style={styles.contactTitle}>Get in Touch</Text>
            <Text style={styles.contactSubtitle}>Need help? We're here for you!</Text>
            
            <View style={styles.contactInfo}>
              <View style={styles.contactItem}>
                <Ionicons name="call" size={20} color={theme.colors.primary} />
                <Text style={styles.contactText}>{contactInfo.phone}</Text>
              </View>
              
              <View style={styles.contactItem}>
                <Ionicons name="mail" size={20} color={theme.colors.primary} />
                <Text style={styles.contactText}>{contactInfo.email}</Text>
              </View>
              
              <View style={styles.contactItem}>
                <Ionicons name="location" size={20} color={theme.colors.primary} />
                <Text style={styles.contactText}>{contactInfo.address}</Text>
              </View>
              
              <View style={styles.contactItem}>
                <Ionicons name="time" size={20} color={theme.colors.primary} />
                <Text style={styles.contactText}>{contactInfo.hours}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.contactButton} onPress={handleContactUs}>
              <Text style={styles.contactButtonText}>Contact Us Now</Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Search Modal */}
      <Modal
        visible={showSearchModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSearchModal(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.searchModalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.searchModalContainer}>
            {/* Search Input */}
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.searchInputContainer}>
                <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
                <TextInput
                  style={styles.searchInput}
                  placeholder={t('home.searchPlaceholder')}
                  placeholderTextColor={theme.colors.textSecondary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus={true}
                  onSubmitEditing={() => handleSearchSubmit(searchQuery)}
                  returnKeyType="search"
                />
                <TouchableOpacity onPress={() => setShowSearchModal(false)}>
                  <Ionicons name="close" size={20} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>

            {/* Search History */}
            {searchHistory.length > 0 && (
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.searchHistoryContainer}>
                  <Text style={styles.searchHistoryTitle}>Recent Searches</Text>
                  <View style={styles.searchHistoryList}>
                    {searchHistory.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.searchHistoryItem}
                        onPress={() => handleSearchHistoryPress(item)}
                      >
                        <Ionicons name="time" size={16} color={theme.colors.textSecondary} />
                        <Text style={styles.searchHistoryText}>{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            )}

            {/* Most Popular Products */}
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.popularProductsContainer}>
                <Text style={styles.popularProductsTitle}>Most Popular</Text>
                <ScrollView 
                  style={styles.popularProductsScroll}
                  showsVerticalScrollIndicator={false}
                >
                {(() => {
                  const popularProducts = (products || []).filter(p => p.rating >= 4.5).slice(0, 5);
                  console.log('Popular products:', popularProducts.length);
                  
                  if (popularProducts.length === 0) {
                    return (
                      <View style={styles.noProductsContainer}>
                        <Text style={styles.noProductsText}>No popular products found</Text>
                      </View>
                    );
                  }
                  
                  return popularProducts.map((item) => {
                    if (!item) return null;
                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.popularProductItem}
                        onPress={() => {
                          setShowSearchModal(false);
                          handleProductPress(item);
                        }}
                      >
                        <Image source={{ uri: item.images?.[0] || '' }} style={styles.popularProductImage} />
                        <View style={styles.popularProductInfo}>
                          <Text style={styles.popularProductName} numberOfLines={2}>{item.name || 'Unknown Product'}</Text>
                          <Text style={styles.popularProductPrice}>${item.price || 0}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
                      </TouchableOpacity>
                    );
                  });
                })()}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: theme.spacing.xxl,
  },
  header: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    ...theme.typography.h4,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  cardText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
  featureList: {
    marginTop: theme.spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  featureText: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.lg,
    ...theme.shadows.md,
  },
  buttonText: {
    ...theme.typography.button,
    color: theme.colors.white,
    marginRight: theme.spacing.sm,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: theme.spacing.xs,
    ...theme.shadows.sm,
  },
  secondaryButtonText: {
    ...theme.typography.buttonSmall,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  // New e-commerce styles
  // Professional Hero Section
  heroSection: {
    height: 300,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    ...theme.shadows.lg,
  },
  heroBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: theme.spacing.lg,
  },
  heroTitle: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    fontWeight: '700',
  },
  heroSubtitle: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    opacity: 0.8,
  },
  heroButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    alignSelf: 'flex-start',
    ...theme.shadows.md,
  },
  heroButtonText: {
    ...theme.typography.button,
    color: 'white',
    marginRight: theme.spacing.sm,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
  seeAllText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.primary,
  },
  categoriesList: {
    paddingHorizontal: theme.spacing.md,
  },
  categoryCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  categoryImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  categoryContent: {
    padding: theme.spacing.lg,
  },
  categoryTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    fontWeight: '600',
  },
  subcategoriesList: {
    gap: theme.spacing.sm,
  },
  subcategoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  subcategoryText: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '500',
  },
  productsList: {
    paddingHorizontal: theme.spacing.md,
  },
  productCard: {
    width: 180,
    marginRight: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  productImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: theme.spacing.md,
  },
  productName: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    fontWeight: '600',
  },
  productPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  productPrice: {
    ...theme.typography.bodyMedium,
    color: theme.colors.primary,
    fontWeight: '700',
    marginRight: theme.spacing.sm,
  },
  originalPrice: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    ...theme.typography.caption,
    color: theme.colors.text,
    marginLeft: theme.spacing.xs,
    fontWeight: '600',
  },
  reviewCount: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  // Testimonials styles
  testimonialsList: {
    paddingHorizontal: theme.spacing.md,
  },
  testimonialCard: {
    width: 280,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginRight: theme.spacing.md,
    ...theme.shadows.md,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  testimonialAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: theme.spacing.md,
  },
  testimonialInfo: {
    flex: 1,
  },
  testimonialName: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    fontWeight: '600',
  },
  testimonialRole: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  testimonialRating: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  testimonialComment: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  // Contact section styles
  contactSection: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  contactCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.md,
  },
  contactTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  contactSubtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  contactInfo: {
    marginBottom: theme.spacing.lg,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  contactText: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
  },
  contactButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },
  contactButtonText: {
    ...theme.typography.button,
    color: 'white',
    marginRight: theme.spacing.md,
  },
  // Search styles
  searchContainer: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    ...theme.shadows.sm,
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  // Search Modal styles
  searchModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  searchModalContainer: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: '80%',
    paddingTop: theme.spacing.lg,
    ...theme.shadows.lg,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    fontSize: 16,
    color: theme.colors.text,
  },
  searchHistoryContainer: {
    marginBottom: theme.spacing.lg,
  },
  searchHistoryTitle: {
    ...theme.typography.h4,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  searchHistoryList: {
    paddingHorizontal: theme.spacing.md,
  },
  searchHistoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  searchHistoryText: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  popularProductsContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  popularProductsScroll: {
    maxHeight: 200,
  },
  popularProductsTitle: {
    ...theme.typography.h4,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  popularProductItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  popularProductImage: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.md,
  },
  popularProductInfo: {
    flex: 1,
  },
  popularProductName: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    fontWeight: '500',
  },
  popularProductPrice: {
    ...theme.typography.bodyMedium,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  noProductsContainer: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  noProductsText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
});
