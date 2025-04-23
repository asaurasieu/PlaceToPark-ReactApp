import React, {useEffect} from 'react';
import {LogBox} from 'react-native';
import App from './App';

LogBox.ignoreLogs(['Possible Unhandled Promise Rejection']);

const AppetizeWrapper = () => {
  useEffect(() => {
    console.log('AppetizeWrapper mounted');

    const errorHandler = (error: Error) => {
      console.error('Global error:', error);
    };

    global.ErrorUtils.setGlobalHandler(errorHandler);

    return () => {
      global.ErrorUtils.setGlobalHandler(() => {});
    };
  }, []);

  return <App />;
};

export default AppetizeWrapper;
