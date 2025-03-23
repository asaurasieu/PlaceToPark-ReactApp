import React from 'react';
import {View, Text, StyleSheet, FlatList, SafeAreaView} from 'react-native';
import {Icon} from 'react-native-eva-icons';
import {useNavigation} from '@react-navigation/native';
import {GestureHandlerRootView, RectButton} from 'react-native-gesture-handler';

const settingsOptions = [
  {title: 'Account', icon: 'person-outline'},
  {title: 'Notifications', icon: 'bell-outline'},
  {title: 'Appearance', icon: 'color-palette-outline'},
  {title: 'Privacy & Security', icon: 'lock-outline'},
  {title: 'Help and Support', icon: 'question-mark-circle-outline'},
  {title: 'Subscription', icon: 'credit-card-outline'},
  {title: 'About', icon: 'info-outline'},
];

const SettingsItem = ({title, icon}) => (
  <RectButton style={styles.item}>
    <Icon name={icon} width={24} height={24} fill="#000" style={styles.icon} />
    <Text style={styles.text}>{title}</Text>
    <Icon
      name="arrow-ios-forward-outline"
      width={24}
      height={24}
      fill="#000"
      style={styles.icon}
    />
  </RectButton>
);

const SettingScreen = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    // Navigate to the logout screen
    navigation.navigate('LoginPage');
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={settingsOptions}
          keyExtractor={item => item.title}
          renderItem={({item}) => (
            <SettingsItem title={item.title} icon={item.icon} />
          )}
          ListFooterComponent={
            <RectButton style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Log Out</Text>
            </RectButton>
          }
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D0D6E0',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
    marginTop: 10,
  },
  text: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  icon: {
    width: 24,
    textAlign: 'center',
  },
  logoutButton: {
    marginTop: 20,
    paddingVertical: 15,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
  },
  logoutButtonText: {
    fontSize: 16,
    color: 'red',
  },
});

export default SettingScreen;
