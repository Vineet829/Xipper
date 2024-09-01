import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, ScrollView, TouchableOpacity, StyleSheet, FlatList, Platform, StatusBar } from 'react-native';
import * as Location from 'expo-location';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const categories = [
  { id: '1', name: 'Travel', image: require('../../assets/images/radisson.jpg') },
  { id: '2', name: 'Food', image: require('../../assets/images/food.jpg') },
  { id: '3', name: 'Shopping', image: require('../../assets/images/shopping.jpg') },
  { id: '4', name: 'Hotel', image: require('../../assets/images/hotel.jpg') },
];

const recommendations = [
  {
    id: '1',
    name: 'Radisson Blue',
    location: 'Vijaynagar, Indore',
    price: '$2000',
    oldPrice: '$2200',
    rating: 4.2,
    reviews: 120,
    image: require('../../assets/images/radisson.jpg'),
    tag: 'Booking fast',
  },
  {
    id: '2',
    name: 'Shreemaya',
    location: 'Palasia, Indore',
    price: '$1800',
    oldPrice: '$2200',
    rating: 3.9,
    reviews: 80,
    image: require('../../assets/images/shree.jpg'),
    tag: '30% Off',
  },
];

const repeatItems = (items, times) => {
  const repeatedItems = [];
  for (let i = 0; i < times; i++) {
    items.forEach(item => {
      repeatedItems.push({ ...item, id: `${item.id}-${i}` });
    });
  }
  return repeatedItems;
};

const repeatedCategories = repeatItems(categories, 5);
const repeatedRecommendations = repeatItems(recommendations, 5);

const HomeScreen = () => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const clearToken = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      console.log('Token cleared successfully');
    } catch (error) {
      console.error('Error clearing token:', error);
    }
  };

  const handleLogout = () => {
    clearToken();
    router.push('/');
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        getCurrentLocation();
      }
    } else if (Platform.OS === 'ios') {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        getCurrentLocation();
      }
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setLocation({ latitude, longitude });

      const addressResponse = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (addressResponse.length > 0) {
        const { city, region, country } = addressResponse[0];
        const fullAddress = `${city}, ${region}, ${country}`;
        setAddress(fullAddress);
      }
    } catch (error) {
      console.error('Error getting location:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderRecommendationItem = ({ item }) => (
    <View style={styles.recommendationCard}>
      <View style={styles.tagContainer}>
        <Text style={styles.tagText}>{item.tag}</Text>
      </View>
      <Image source={item.image} style={styles.recommendationImage} />
      <View style={styles.recommendationInfo}>
        <View style={styles.ratingContainer}>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingBadgeText}>{item.rating}</Text>
          </View>
          <Text style={styles.ratingText}>
            {item.rating >= 4.0 ? 'Very good' : 'Good'} ({item.reviews} ratings)
          </Text>
        </View>
        <View>
          <View style={styles.titleAndPriceContainer1}>
            <Text style={styles.recommendationTitle}>{item.name}</Text>
            <Text style={styles.oldPrice}>{item.oldPrice}</Text>
          </View>
          <View style={styles.titleAndPriceContainer}>
            <Text style={styles.recommendationLocation}>{item.location}</Text>
            <Text style={styles.recommendationPrice}>{item.price}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#7B2CBF" />
      <View style={styles.headerContainer}>
        <View style={styles.locationContainer}>
          <MaterialIcons name="location-on" size={30} color="#FFF" style={styles.icon} />
          <Text style={styles.locationText} numberOfLines={2}>
            {loading ? 'Loading...' : address || 'Crown Pride Colony, Silicon city, Indore, M.P.'}
          </Text>
          <View style={styles.locationIcon}>
            <AntDesign name="creditcard" size={24} color="#FFF" />
            <Feather name="bell" size={24} color="#FFF" style={styles.icon} />
          </View>
        </View>

        <View style={styles.searchBarContainer}>
          <Feather name="search" size={20} color="#7B7B7B" style={styles.searchIcon} />
          <TextInput
            placeholder="Search for 'Hotels'"
            style={styles.searchInput}
          />
        </View>
      </View>

      <ScrollView style={styles.contentContainer}>
        <View style={styles.categoriesHeaderContainer}>
          <Text style={styles.sectionTitle}>Top Categories</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          data={repeatedCategories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.categoryItem}>
              <Image source={item.image} style={styles.categoryImage} />
              <Text style={styles.categoryText}>{item.name}</Text>
            </View>
          )}
          showsHorizontalScrollIndicator={false}
        />

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Recommended for you</Text>
        <Text style={styles.sectionSubText}>
          We recommend these based on your past orders and searches
        </Text>
        <FlatList
          horizontal
          data={repeatedRecommendations}
          keyExtractor={(item) => item.id}
          renderItem={renderRecommendationItem}
          showsHorizontalScrollIndicator={false}
          style={styles.recommendationsList}
        />
      </ScrollView>

      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.navItem}>
          <AntDesign name="home" size={24} color="black" style={[styles.navIcon, styles.activeNavText]} />
          <Text style={[styles.navText, styles.activeNavText]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <AntDesign name="creditcard" size={24} color="black" style={styles.navIcon} />
          <Text style={styles.navText}>Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Feather name="inbox" size={24} color="black" style={styles.navIcon} />
          <Text style={styles.navText}>Inbox</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="account-circle" size={24} color="black" style={styles.navIcon} />
          <Text style={styles.navText}>Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  headerContainer: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#7B2CBF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 5,
    gap: -20,
    paddingHorizontal:10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-around',
    height: '20%',
  },
  locationText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: 'normal',
    flex: 1,
    textAlign: 'start',
    marginLeft:5,
    marginTop:5,
  },
  locationIcon:{
    display: 'flex',
    flexDirection: 'row',
    gap:20,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    width: '96%',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
  },
  contentContainer: {
    paddingHorizontal: 15,
    flex: 1,
  },
  categoriesHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop:12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom:10,
  },
  sectionSubText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  seeAllText: {
    fontSize: 14,
    color: '#FFFFFF',
    backgroundColor:"#7B2CBF",
    width:86,
    height:35,
    marginRight:20,
    paddingTop:5,
    paddingLeft:20,
    borderRadius:10,
    marginTop:5,
    marginBottom:16,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 15,
  },
  categoryImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 18,
    color: '#333',
  },
  recommendationsList: {
    marginTop: 10,
  },
  recommendationCard: {
    width: 220,
    borderRadius: 10,
    marginRight: 15,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  recommendationImage: {
    width: '100%',
    height: 150,
  },
  recommendationInfo: {
    padding: 10,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop:20,
  },
  titleAndPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleAndPriceContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop:-10,
  },
  recommendationLocation: {
    fontSize: 14,
    color: '#666',
  },
  oldPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    alignSelf: 'flex-end',
  },
  recommendationPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  ratingBadge: {
    backgroundColor: '#7B2CBF',
    borderRadius: 5,
    padding: 3,
    marginRight: 5,
  },
  ratingBadgeText: {
    color: '#FFF',
    fontSize: 12,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
  },
  tagContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#7B2CBF',
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
    zIndex: 1,
  },
  tagText: {
    color: '#FFF',
    fontSize: 12,
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    marginBottom: 5,
  },
  navText: {
    fontSize: 12,
    color: '#333',
  },
  activeNavText: {
    color: '#7B2CBF',
  },
  logoutButton: {
    backgroundColor: '#7B2CBF', 
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
