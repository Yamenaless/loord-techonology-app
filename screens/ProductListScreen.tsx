import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { theme } from '../data/theme';
import { products, categories } from '../data/dummyData';
import { useCart } from '../contexts/CartContext';

export default function ProductListScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { category, searchQuery: routeSearchQuery } = route.params as { category?: any, searchQuery?: string } || {};
  const { addToCart, getCartItemCount } = useCart();
  
  const [searchQuery, setSearchQuery] = useState(routeSearchQuery || '');
  const [selectedCategory, setSelectedCategory] = useState(category?.name || 'All');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set initial category from route params
    if (category?.name) {
      setSelectedCategory(category.name);
    }
    if (routeSearchQuery) {
      setSearchQuery(routeSearchQuery);
    }
    
    // Initialize with products if available
    if (products && products.length > 0) {
      setFilteredProducts(products);
      setIsLoading(false);
    } else {
      console.log('Products not loaded yet:', products);
      setIsLoading(false);
    }
  }, [category, routeSearchQuery]);

  useEffect(() => {
    if (products && products.length > 0) {
      console.log(`Total products available: ${products.length}`);
      console.log(`Available categories:`, [...new Set(products.map(p => p.category))]);
      filterProducts();
    }
  }, [searchQuery, selectedCategory, sortBy]);

  const filterProducts = () => {
    if (!products || products.length === 0) {
      setFilteredProducts([]);
      setIsLoading(false);
      return;
    }

    let filtered = [...products]; // Create a copy to avoid mutating the original

    // Filter by category
    if (selectedCategory !== 'All') {
      if (selectedCategory === 'PS5') {
        filtered = filtered.filter(product => product.name.includes('PlayStation 5'));
      } else if (selectedCategory === 'PS4') {
        filtered = filtered.filter(product => product.name.includes('PlayStation 4'));
      } else if (selectedCategory === 'Xbox Series X') {
        filtered = filtered.filter(product => product.name.includes('Xbox Series X'));
      } else if (selectedCategory === 'Xbox One') {
        filtered = filtered.filter(product => product.name.includes('Xbox One'));
      } else if (selectedCategory === 'Nintendo Switch') {
        filtered = filtered.filter(product => product.name.includes('Nintendo Switch'));
      } else if (selectedCategory === 'PlayStation') {
        filtered = filtered.filter(product => product.name.includes('PlayStation'));
      } else if (selectedCategory === 'Xbox') {
        filtered = filtered.filter(product => product.name.includes('Xbox'));
      } else if (selectedCategory === 'Nintendo') {
        filtered = filtered.filter(product => product.name.includes('Nintendo'));
      } else {
        filtered = filtered.filter(product => product.category === selectedCategory);
      }
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
    setIsLoading(false);
    console.log(`Filtered ${filtered.length} products for category: ${selectedCategory}`);
  };

  const handleProductPress = (product: any) => {
    (navigation as any).navigate('ProductDetails', { product });
  };

  const handleAddToCart = (product: any) => {
    addToCart(product);
  };

  const handleCartPress = () => {
    (navigation as any).navigate('Cart');
  };

  const renderProduct = ({ item }: { item: any }) => {
    if (!item) return null;
    
    return (
      <View style={styles.productCard}>
        <TouchableOpacity 
          style={styles.productCardContent} 
          onPress={() => handleProductPress(item)}
        >
          <Image source={{ uri: item.images?.[0] || '' }} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.productDescription} numberOfLines={2}>{item.description}</Text>
          <View style={styles.productPriceContainer}>
            <Text style={styles.productPrice}>${item.price}</Text>
            {item.originalPrice && (
              <Text style={styles.originalPrice}>${item.originalPrice}</Text>
            )}
          </View>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.rating}>{item.rating}</Text>
            <Text style={styles.reviewCount}>({item.reviewCount})</Text>
          </View>
          <View style={styles.stockContainer}>
            <Ionicons 
              name={item.inStock ? "checkmark-circle" : "close-circle"} 
              size={16} 
              color={item.inStock ? theme.colors.success : theme.colors.error} 
            />
            <Text style={[styles.stockText, { color: item.inStock ? theme.colors.success : theme.colors.error }]}>
              {item.inStock ? 'In Stock' : 'Out of Stock'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.addToCartButton, !item.inStock && styles.addToCartButtonDisabled]}
        onPress={() => item.inStock && handleAddToCart(item)}
        disabled={!item.inStock}
      >
        <Ionicons name="add" size={16} color="white" />
        <Text style={styles.addToCartText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
    );
  };

  const renderCategoryFilter = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.categoryFilter,
        selectedCategory === item.name && styles.selectedCategoryFilter
      ]}
      onPress={() => setSelectedCategory(item.name)}
    >
      <Text style={[
        styles.categoryFilterText,
        selectedCategory === item.name && styles.selectedCategoryFilterText
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{selectedCategory === 'All' ? 'Products' : selectedCategory}</Text>
        <TouchableOpacity style={styles.cartButton} onPress={handleCartPress}>
          <Ionicons name="cart" size={24} color={theme.colors.text} />
          {getCartItemCount() > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{getCartItemCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Filters */}
      <View style={styles.filtersContainer}>
        <FlatList
          data={[
            { name: 'All' },
            { name: 'Graphics Cards' },
            { name: 'Processors' },
            { name: 'Motherboards' },
            { name: 'Memory' },
            { name: 'Storage' },
            { name: 'Laptops' },
            { name: 'Gaming Laptops' },
            { name: 'MacBooks' },
            { name: 'Business Laptops' },
            { name: 'Ultrabooks' },
            { name: 'Workstations' },
            { name: 'Mice' },
            { name: 'Headsets' },
            { name: 'Controllers' },
            { name: 'Keyboards' },
            { name: 'Monitors' },
            { name: 'Mousepads' },
            { name: 'Power Supplies' },
            { name: 'Cases' },
            { name: 'Cooling' },
            { name: 'Gaming Consoles' },
            { name: 'PS5' },
            { name: 'PS4' },
            { name: 'Xbox Series X' },
            { name: 'Xbox One' },
            { name: 'Nintendo Switch' },
            { name: 'PlayStation' },
            { name: 'Xbox' },
            { name: 'Nintendo' }
          ]}
          renderItem={renderCategoryFilter}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryFilters}
          keyExtractor={(item, index) => item.name + index}
        />
      </View>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <TouchableOpacity 
          style={[styles.sortButton, sortBy === 'name' && styles.activeSortButton]}
          onPress={() => setSortBy('name')}
        >
          <Text style={[styles.sortButtonText, sortBy === 'name' && styles.activeSortButtonText]}>
            Name
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.sortButton, sortBy === 'price-low' && styles.activeSortButton]}
          onPress={() => setSortBy('price-low')}
        >
          <Text style={[styles.sortButtonText, sortBy === 'price-low' && styles.activeSortButtonText]}>
            Price ↑
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.sortButton, sortBy === 'price-high' && styles.activeSortButton]}
          onPress={() => setSortBy('price-high')}
        >
          <Text style={[styles.sortButtonText, sortBy === 'price-high' && styles.activeSortButtonText]}>
            Price ↓
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.sortButton, sortBy === 'rating' && styles.activeSortButton]}
          onPress={() => setSortBy('rating')}
        >
          <Text style={[styles.sortButtonText, sortBy === 'rating' && styles.activeSortButtonText]}>
            Rating
          </Text>
        </TouchableOpacity>
      </View>

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      {/* Products List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          numColumns={2}
          contentContainerStyle={styles.productsList}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  cartButton: {
    padding: theme.spacing.sm,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  cartBadgeText: {
    ...theme.typography.caption,
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...theme.typography.body,
    color: theme.colors.text,
    paddingVertical: theme.spacing.sm,
  },
  filtersContainer: {
    marginBottom: theme.spacing.md,
  },
  categoryFilters: {
    paddingHorizontal: theme.spacing.md,
  },
  categoryFilter: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
  },
  selectedCategoryFilter: {
    backgroundColor: theme.colors.primary,
  },
  categoryFilterText: {
    ...theme.typography.caption,
    color: theme.colors.text,
    fontWeight: '500',
  },
  selectedCategoryFilterText: {
    color: 'white',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  sortLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.sm,
  },
  sortButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    marginRight: theme.spacing.sm,
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
  },
  activeSortButton: {
    backgroundColor: theme.colors.primary,
  },
  sortButtonText: {
    ...theme.typography.caption,
    color: theme.colors.text,
    fontWeight: '500',
  },
  activeSortButtonText: {
    color: 'white',
  },
  resultsContainer: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  resultsText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  productsList: {
    padding: theme.spacing.md,
  },
  productCard: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    margin: theme.spacing.xs,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  productCardContent: {
    flex: 1,
  },
  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: theme.spacing.sm,
  },
  productName: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  productDescription: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  productPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  productPrice: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: 'bold',
    marginRight: theme.spacing.xs,
  },
  originalPrice: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
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
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockText: {
    ...theme.typography.caption,
    marginLeft: theme.spacing.xs,
    fontWeight: '500',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    margin: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  addToCartButtonDisabled: {
    backgroundColor: theme.colors.textSecondary,
    opacity: 0.6,
  },
  addToCartText: {
    ...theme.typography.caption,
    color: 'white',
    fontWeight: '600',
    marginLeft: theme.spacing.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xxxl,
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
});
