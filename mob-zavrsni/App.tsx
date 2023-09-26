import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './auth/authContext';
import StudentsProvider from './context/classContext';
import GameProvider from './context/gameContext';
import StudentProvider from './context/studentContext';

import useCachedResources from './hooks/useCachedResources';
import Navigation from './navigation';

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <StudentsProvider>
        <AuthProvider>
          <StudentProvider>
            <GameProvider>
              <SafeAreaProvider>
                <Navigation />
                <StatusBar />
              </SafeAreaProvider>
            </GameProvider>
          </StudentProvider>
        </AuthProvider>
      </StudentsProvider>
    );
  }
}
