import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {AppContextProvider} from './store/context';
import {
  View,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import SoundControl from './components/userSoundControl/SoundControl';
import {useState, useEffect} from 'react';
import {AppState} from 'react-native';
import {
  setupPlayer,
  playBackgroundMusic,
  pauseBackgroundMusic,
} from './components/userSoundControl/player';

import WelcomeScreen from './screen/Stack/StackWelcomeScreen';
import {
  TabHarborScreen,
  TabQuizScreen,
  TabShipsBattle,
  TabStatistickScreen,
} from './screen/Tab';
import {
  StackAdmiralScreen,
  StackBattleDetail,
  StackBattleScreen,
  StackQuizScreen,
  StackShipsBattle,
} from './screen/Stack';
import {toggleBackgroundMusic} from './components/userSoundControl/player';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const [isSoundOn, setIsSoundOn] = useState(true);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active' && isSoundOn) {
        playBackgroundMusic();
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        pauseBackgroundMusic();
      }
    });

    // Initialize sound when app starts
    const initSound = async () => {
      await setupPlayer();
      await playBackgroundMusic();
      setIsSoundOn(true);
    };

    initSound();

    return () => {
      subscription.remove();
      pauseBackgroundMusic();
    };
  }, []);

  const handleSoundToggle = () => {
    const newState = toggleBackgroundMusic();
    setIsSoundOn(newState);
  };

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        animation: 'fade',
        animationDuration: 1000,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          <LinearGradient
            colors={['rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 0.95)']}
            style={styles.tabBarGradient}
          />
        ),
        tabBarIcon: ({focused}) => {
          let iconSource;

          switch (route.name) {
            case 'TabQuizScreen':
              iconSource = require('./assets/icons/book.png');
              break;
            case 'TabHarborScreen':
              iconSource = require('./assets/icons/boat.png');
              break;
            case 'TabShipsBattle':
              iconSource = require('./assets/icons/game-controller.png');
              break;
            case 'TabStatistickScreen':
              iconSource = require('./assets/icons/history.png');
              break;
            case 'Sound':
              iconSource = require('./assets/icons/melody.png');
              break;
          }

          return (
            <Image
              source={iconSource}
              style={[
                styles.tabIcon,
                {
                  tintColor: focused ? '#4ECDC4' : '#95A5A6',
                  // For sound icon, use the sound state instead of focused
                  ...(route.name === 'Sound' && {
                    tintColor: isSoundOn ? '#4ECDC4' : '#95A5A6',
                  }),
                },
              ]}
              resizeMode="contain"
            />
          );
        },
        tabBarActiveTintColor: '#4ECDC4',
        tabBarInactiveTintColor: '#95A5A6',
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      })}>
      <Tab.Screen
        name="TabHarborScreen"
        component={TabHarborScreen}
        options={{tabBarLabel: 'Harbor'}}
      />
      <Tab.Screen
        name="TabQuizScreen"
        component={TabQuizScreen}
        options={{tabBarLabel: 'Quiz'}}
      />
      <Tab.Screen
        name="TabShipsBattle"
        component={TabShipsBattle}
        options={{tabBarLabel: 'Battle'}}
      />
      <Tab.Screen
        name="TabStatistickScreen"
        component={TabStatistickScreen}
        options={{tabBarLabel: 'History'}}
      />
      <Tab.Screen
        name="Sound"
        component={EmptyComponent}
        options={{
          tabBarLabel: 'Sound',
          tabBarButton: props => (
            <TouchableOpacity
              {...props}
              onPress={handleSoundToggle}
              // style={styles.tabBarItemSound}
            >
              <Image
                source={require('./assets/icons/melody.png')}
                style={[
                  styles.tabIconSound,
                  {tintColor: isSoundOn ? '#4ECDC4' : '#95A5A6'},
                ]}
              />
              <Text
                style={[
                  styles.tabBarLabelSound,
                  {color: isSoundOn ? '#4ECDC4' : '#95A5A6'},
                ]}>
                Sound
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const EmptyComponent = () => null;

function App() {
  return (
    <AppContextProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            animationDuration: 1000,
          }}>
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
          <Stack.Screen name="StackQuizScreen" component={StackQuizScreen} />
          <Stack.Screen name="StackShipsBattle" component={StackShipsBattle} />
          <Stack.Screen
            name="StackAdmiralScreen"
            component={StackAdmiralScreen}
          />
          <Stack.Screen
            name="StackBattleDetail"
            component={StackBattleDetail}
          />
          <Stack.Screen
            name="StackBattleScreen"
            component={StackBattleScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppContextProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 4,
    left: 10,
    right: 10,
    height: 95,
    borderRadius: 15,
    backgroundColor: 'transparent',
    elevation: 0,
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    paddingBottom: 10,
    marginHorizontal: 2,
  },
  tabBarGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 15,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 16,
  },
  tabBarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // paddingTop: 10,
  },
  tabIcon: {
    width: 44,
    height: 45,
    marginTop: 12,
  },
  tabIconSound: {
    width: 44,
    height: 45,
    // marginTop: 12,
  },
  tabBarLabelSound: {
    fontSize: 12,
    // fontWeight: '600',
    // marginTop: 2,
    // color: 'red',
    textAlign: 'center',
  },
  tabBarItemSound: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // paddingTop: 10,
  },
});

export default App;
