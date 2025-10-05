import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { theme } from '../data/theme';
import { products, reviews } from '../data/dummyData';

const { width } = Dimensions.get('window');

export default function ProductDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { product } = route.params as { product: any };
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const scrollViewRef = React.useRef<ScrollView>(null);

  // Get related products (same category, excluding current product)
  const relatedProducts = (products || [])
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Get reviews for this product
  const productReviews = (reviews || []).filter(r => r.productId === product.id);

  const handleAddToCart = () => {
    Alert.alert(
      'Added to Cart',
      `${product.name} (${quantity}) has been added to your cart.`,
      [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'View Cart', onPress: () => (navigation as any).navigate('Cart') },
      ]
    );
  };

  const handleBuyNow = () => {
    (navigation as any).navigate('Checkout', { product, quantity });
  };

  const handleImageChange = (index: number) => {
    setCurrentImageIndex(index);
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(prev => !prev);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={16}
          color="#FFD700"
        />
      );
    }
    return stars;
  };

  const renderReview = ({ item }: { item: any }) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Image source={{ uri: item.userAvatar }} style={styles.reviewAvatar} />
        <View style={styles.reviewUserInfo}>
          <View style={styles.reviewUserRow}>
            <Text style={styles.reviewUserName}>{item.userName}</Text>
            {item.verified && (
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
            )}
          </View>
          <View style={styles.reviewRating}>
            {renderStars(item.rating)}
            <Text style={styles.reviewDate}>{item.date}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.reviewTitle}>{item.title}</Text>
      <Text style={styles.reviewComment}>{item.comment}</Text>
    </View>
  );

  const renderRelatedProduct = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.relatedProductCard}
      onPress={() => (navigation as any).navigate('ProductDetails', { product: item })}
    >
      <Image source={{ uri: item.images[0] }} style={styles.relatedProductImage} />
      <Text style={styles.relatedProductName} numberOfLines={2}>{item.name}</Text>
      <Text style={styles.relatedProductPrice}>${item.price}</Text>
      <View style={styles.relatedProductRating}>
        <Ionicons name="star" size={12} color="#FFD700" />
        <Text style={styles.relatedProductRatingText}>{item.rating}</Text>
      </View>
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
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="share" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={toggleFavorite}>
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={24} 
              color={isFavorite ? theme.colors.error : theme.colors.text} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Product Images Carousel */}
        <View style={styles.imageContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentImageIndex(index);
            }}
            style={styles.imageScrollView}
          >
            {(product.images || []).map((image: string, index: number) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.mainImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          
          {/* Image Counter */}
          <View style={styles.imageCounter}>
            <Text style={styles.imageCounterText}>
              {currentImageIndex + 1} / {product.images.length}
            </Text>
          </View>
          
          {/* Image Indicators */}
          <View style={styles.imageIndicators}>
            {(product.images || []).map((_: any, index: number) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.indicator,
                  currentImageIndex === index && styles.activeIndicator
                ]}
                onPress={() => {
                  setCurrentImageIndex(index);
                  // Scroll to the selected image
                  scrollViewRef.current?.scrollTo({
                    x: index * width,
                    animated: true,
                  });
                }}
              />
            ))}
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {renderStars(Math.floor(product.rating))}
            </View>
            <Text style={styles.ratingText}>{product.rating}</Text>
            <Text style={styles.reviewCount}>({product.reviewCount} reviews)</Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>${product.price}</Text>
            {product.originalPrice && (
              <>
                <Text style={styles.originalPrice}>${product.originalPrice}</Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </Text>
                </View>
              </>
            )}
          </View>

          <Text style={styles.description}>{product.description}</Text>

          {/* Stock Status */}
          <View style={styles.stockContainer}>
            <Ionicons 
              name={product.inStock ? "checkmark-circle" : "close-circle"} 
              size={20} 
              color={product.inStock ? theme.colors.success : theme.colors.error} 
            />
            <Text style={[
              styles.stockText, 
              { color: product.inStock ? theme.colors.success : theme.colors.error }
            ]}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </Text>
          </View>

          {/* Quantity Selector */}
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantity:</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity 
                style={styles.quantityButton} 
                onPress={decrementQuantity}
                disabled={quantity <= 1}
              >
                <Ionicons name="remove" size={20} color={theme.colors.text} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity 
                style={styles.quantityButton} 
                onPress={incrementQuantity}
              >
                <Ionicons name="add" size={20} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Specifications */}
          {product.specifications && (
            <View style={styles.specificationsContainer}>
              <Text style={styles.specificationsTitle}>Specifications:</Text>
              {Object.entries(product.specifications).map(([key, value]) => (
                <View key={key} style={styles.specificationRow}>
                  <Text style={styles.specificationKey}>{key}:</Text>
                  <Text style={styles.specificationValue}>{String(value)}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Features */}
          {product.features && (
            <View style={styles.featuresContainer}>
              <Text style={styles.featuresTitle}>Key Features:</Text>
              {(product.features || []).map((feature: string, index: number) => (
                <View key={index} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Customer Reviews */}
          {productReviews.length > 0 && (
            <View style={styles.reviewsContainer}>
              <Text style={styles.reviewsTitle}>Customer Reviews ({productReviews.length})</Text>
              <FlatList
                data={productReviews}
                renderItem={renderReview}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <View style={styles.relatedContainer}>
              <Text style={styles.relatedTitle}>More {product.category}</Text>
              <FlatList
                data={relatedProducts}
                renderItem={renderRelatedProduct}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.relatedProductsList}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity 
          style={styles.addToCartButton} 
          onPress={handleAddToCart}
          disabled={!product.inStock}
        >
          <Ionicons name="cart" size={20} color="white" />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.buyNowButton} 
          onPress={handleBuyNow}
          disabled={!product.inStock}
        >
          <Text style={styles.buyNowText}>Buy Now</Text>
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
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    ...theme.shadows.sm,
  },
  backButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    backgroundColor: theme.colors.white,
    height: 350,
  },
  imageScrollView: {
    flex: 1,
  },
  mainImage: {
    width: width,
    height: 350,
  },
  imageCounter: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  imageCounterText: {
    ...theme.typography.caption,
    color: 'white',
    fontWeight: '600',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: theme.colors.primary,
  },
  productInfo: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    marginTop: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  productName: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: theme.spacing.md,
  },
  ratingText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    marginRight: theme.spacing.sm,
  },
  reviewCount: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  price: {
    ...theme.typography.h2,
    color: theme.colors.primary,
    fontWeight: '700',
    marginRight: theme.spacing.md,
  },
  originalPrice: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textDecorationLine: 'line-through',
    marginRight: theme.spacing.md,
  },
  discountBadge: {
    backgroundColor: theme.colors.error,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  discountText: {
    ...theme.typography.caption,
    color: 'white',
    fontWeight: '600',
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 24,
    marginBottom: theme.spacing.lg,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  stockText: {
    ...theme.typography.body,
    marginLeft: theme.spacing.sm,
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  quantityLabel: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
  },
  quantityButton: {
    padding: theme.spacing.sm,
    minWidth: 40,
    alignItems: 'center',
  },
  quantityText: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
    marginHorizontal: theme.spacing.md,
    minWidth: 30,
    textAlign: 'center',
  },
  featuresContainer: {
    marginBottom: theme.spacing.xl,
  },
  featuresTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
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
  bottomActions: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
    ...theme.shadows.lg,
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginRight: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  addToCartText: {
    ...theme.typography.button,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  buyNowButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    ...theme.shadows.md,
  },
  buyNowText: {
    ...theme.typography.button,
    color: 'white',
  },
  // Kit Global enhanced features styles
  specificationsContainer: {
    backgroundColor: theme.colors.white,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },
  specificationsTitle: {
    ...theme.typography.h4,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  specificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  specificationKey: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  specificationValue: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    flex: 1,
    textAlign: 'right',
    fontWeight: '500',
  },
  reviewsContainer: {
    backgroundColor: theme.colors.white,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },
  reviewsTitle: {
    ...theme.typography.h4,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  reviewItem: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: theme.spacing.sm,
  },
  reviewUserInfo: {
    flex: 1,
  },
  reviewUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  reviewUserName: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
    marginRight: theme.spacing.xs,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewDate: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
  },
  reviewTitle: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  reviewComment: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  relatedContainer: {
    marginBottom: theme.spacing.xl,
  },
  relatedTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  relatedProductsList: {
    paddingHorizontal: theme.spacing.xs,
  },
  relatedProductCard: {
    width: 160,
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.sm,
    marginRight: theme.spacing.md,
  },
  relatedProductImage: {
    width: '100%',
    height: 100,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  relatedProductName: {
    ...theme.typography.caption,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  relatedProductPrice: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  relatedProductRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  relatedProductRatingText: {
    ...theme.typography.caption,
    color: theme.colors.text,
    marginLeft: theme.spacing.xs,
  },
});
