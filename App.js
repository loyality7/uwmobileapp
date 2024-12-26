import React, { useEffect, useState } from 'react';
import { AuthProvider } from './src/screens/AuthModule/AuthContext';
import {Provider} from 'react-redux';
import StackNavigation from './src/navigation/StackNavigation';
import store, {persister} from './src/redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './src/navigation/RootNavigation';
import {StyleSheet, View, Image, SafeAreaView, Platform, StatusBar} from 'react-native';
import './ReactoronConfig';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');

    
    setTimeout(() => {
      setIsLoading(false);  
    }, 3000);
  }, []);

  const SplashScreen = () => (
    <View style={styles.splashContainer}>
      <Image
        source={require('./src/assets/Splash.png')}
        style={styles.logo}
      />
    </View>
  );

  if (isLoading) {
    return (
      <>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <SplashScreen />
      </>
    );  
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar 
        translucent={true}
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persister}>
              <NavigationContainer ref={navigationRef}>
                <StackNavigation />
              </NavigationContainer>
            </PersistGate>
          </Provider>
        </AuthProvider>
      </GestureHandlerRootView>
    </View>
  );
}
// Splash Screen Styles
const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2DBDEE',
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 20,

  },
  text: {
    fontSize: 20,
    color: '#333',
  },
});
export default App;

