import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, StatusBar } from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import CountryPicker from 'react-native-country-picker-modal';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fetchFonts = () => {
  return Font.loadAsync({
    'poppins-regular': require('../../assets/fonts/Poppins/Poppins-Regular.ttf'),
  });
};

const LoginScreen = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [countryCode, setCountryCode] = useState('IN');
  const [callingCode, setCallingCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();

  useEffect(() => {
    const originalWarn = console.warn;
    console.warn = (message, ...args) => {
      if (typeof message === 'string' && message.includes('defaultProps')) {
        return;
      }
      originalWarn(message, ...args);
    };

    return () => {
      console.warn = originalWarn;
    };
  }, []);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await fetchFonts();
      } finally {
        setFontsLoaded(true);
        await SplashScreen.hideAsync();
      }
    };

    loadFonts();
  }, []);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        router.push('/home');
      }
    };

    checkToken();
  }, [router]);

  if (!fontsLoaded) {
    return null;
  }

  const handleVerify = async () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    const fullPhoneNumber = `${callingCode}${phoneNumber}`;

    try {
      const response = await axios.post('http://192.168.1.3:5000/api/auth/send-otp', {
        phoneNumber: fullPhoneNumber,
      });

      Alert.alert('Success', response.data.msg);

      router.push({
        pathname: '/verify',
        params: { phoneNumber: fullPhoneNumber },
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP');
    }
  };

  return (
    <View style={styles.container}>
      
      <StatusBar barStyle="light-content" backgroundColor="#6D38C3" />
      
      <View>
        <Text style={styles.welcomeText}>Welcome to</Text>
        <View style={{alignItems:'center', alignSelf:'center', flexDirection:'row', marginBottom:90}}>
          <Image source={require('../../assets/images/xuna.png')}/>
          <Text style={styles.brandText}>XIPPER</Text>
        </View>
      </View>
      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Sign Up or Login</Text>
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.countryCodeContainer}>
          <CountryPicker
            countryCode={countryCode}
            withFilter
            withFlag
            withAlphaFilter
            withCallingCode
            withCallingCodeButton
            onSelect={(country) => {
              setCountryCode(country.cca2);
              setCallingCode(`+${country.callingCode}`);
            }}
          />
        </View>
        <TextInput
          placeholder="Please enter your number"
          style={styles.input}
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </View>
      <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
        <Text style={styles.verifyButtonText}>Verify</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.referralText}>
          Have a <Text style={{ color: 'black',  textDecorationLine: 'underline',}}>Referral Code?</Text>
        </Text>
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text style={styles.footerText}>By continuing you agree to Apps </Text>
        <TouchableOpacity>
          <Text style={styles.linkText}>Terms of Services</Text>
        </TouchableOpacity>
        <Text style={styles.footerText}> and </Text>
        <TouchableOpacity>
          <Text style={styles.linkText}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6D38C3',
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 10,
    fontFamily: 'poppins-regular',
  },
  brandText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
  signUpContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  signUpText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '90%',
  },
  countryCodeContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 12,
    color: '#000',
    fontFamily: 'poppins-regular',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  verifyButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 146,
    borderRadius: 8,
    marginBottom: 20,
    marginTop: 6,
  },
  verifyButtonText: {
    color: '#7B2CBF',
    fontSize: 13,
    fontFamily: 'poppins-regular',
    fontWeight: 'bold',
  },
  referralText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'poppins-regular',
    marginTop: 20,
    marginBottom: 90,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  footerText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'poppins-regular',
  },
  linkText: {
    color: 'black',
    fontSize: 14,
    textDecorationLine: 'underline',
    fontFamily: 'poppins-regular',
  },
});

export default LoginScreen;
