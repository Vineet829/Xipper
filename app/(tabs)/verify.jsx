import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';


const OtpVerificationScreen = () => {
  const { phoneNumber } = useLocalSearchParams();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const router = useRouter();
  const otpInputs = useRef([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < otp.length - 1) {
      otpInputs.current[index + 1].focus();
    }
  };

  const handleSubmit = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    try {
      const response = await axios.post('http://192.168.1.3:5000/api/auth/verify-otp', {
        phoneNumber,
        otp: enteredOtp,
      });

      if (response.data.token) {
        await AsyncStorage.setItem('authToken', response.data.token);
        Alert.alert('Success', 'OTP verified successfully');
        router.push('/home');
      } else {
        Alert.alert('Error', 'Failed to verify OTP');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.response.data.msg || 'Failed to verify OTP');
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await axios.post('http://192.168.1.3:5000/api/auth/send-otp', {
        phoneNumber,
      });

      Alert.alert('Success', response.data.msg);
      setTimer(30);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to resend OTP');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Add StatusBar component */}
      <StatusBar barStyle="dark-content" backgroundColor="#F7F7F7" />

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>{'<-'}</Text>
      </TouchableOpacity>

      <Text style={styles.titleText}>Verify OTP</Text>
      <Text style={styles.instructionText}>
        Please enter OTP received at your mobile number {phoneNumber}
      </Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            style={styles.otpInput}
            keyboardType="numeric"
            maxLength={1}
            autoFocus={index === 0}
            ref={(input) => (otpInputs.current[index] = input)}
          />
        ))}
      </View>

      <View style={styles.timerContainer}>
        <Text style={styles.autoFetchingText}>Auto fetching</Text>
        <Text style={styles.timerText}>{timer}s</Text>
      </View>

      <TouchableOpacity style={styles.resendContainer} onPress={handleResendOtp}>
        <Text style={styles.resendText}>Didn’t receive an OTP?</Text>
        <Text style={styles.resendLink}>Resend OTP</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7F7F7',
  },
  backButton: {
    marginBottom: 20,
    marginTop: 80,
  },
  backText: {
    fontSize: 24,
    color: '#000',
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 16,
    color: '#7B7B7B',
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  otpInput: {
    width: 42,
    height: 50,
    borderWidth: 1,
    borderColor: '#7B7B7B',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 24,
    color: '#000',
    marginHorizontal: 5,
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  autoFetchingText: {
    fontSize: 16,
    color: '#7B7B7B',
  },
  timerText: {
    fontSize: 16,
    color: '#7B7B7B',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 50,
    marginTop: 40,
  },
  resendText: {
    fontSize: 16,
    color: '#7B7B7B',
  },
  resendLink: {
    fontSize: 16,
    color: '#7B2CBF',
    textDecorationLine: 'underline',
  },
  submitButton: {
    backgroundColor: '#7B2CBF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default OtpVerificationScreen;
