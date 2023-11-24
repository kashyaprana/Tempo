import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import AppNav from './src/navigation/AppNav';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {

  return (
    <NavigationContainer>

      <AppNav />


    </NavigationContainer>
  )
}

