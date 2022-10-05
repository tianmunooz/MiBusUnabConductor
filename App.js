import React, {useEffect, useState} from 'react';
import {Platform, SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service'; // 👈

const App = () => {
  const [location, setLocation] = useState(null); // 👈

  const handleLocationPermission = async () => {
    let permissionCheck = '';
    if (Platform.OS === 'ios') {
      permissionCheck = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

      if (permissionCheck === RESULTS.DENIED) {
        const permissionRequest = await request(
          PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        );
        permissionRequest === RESULTS.GRANTED
          ? console.warn('Location permission granted.')
          : console.warn('Location perrmission denied.');
      }
    }

    if (Platform.OS === 'android') {
      permissionCheck = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

      if (permissionCheck === RESULTS.DENIED) {
        const permissionRequest = await request(
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        );
        permissionRequest === RESULTS.GRANTED
          ? console.warn('Location permission granted.')
          : console.warn('Location perrmission denied.');
      }
    }
  };

  useEffect(() => {
    handleLocationPermission();
  }, []);

  useEffect(() => {
    // 👈
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setLocation({latitude, longitude});
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {location && ( // 👈
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: location.latitude, // 👈
            longitude: location.longitude, // 👈
            latitudeDelta: 0.000422,
            longitudeDelta: 0.000521,
          }}
          showsUserLocation={true}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default App;
