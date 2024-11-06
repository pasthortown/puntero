import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Gyroscope } from 'expo-sensors';

export default function GyroscopeScreen() {
  const [gyroscopeData, setGyroscopeData] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    // Suscripción al giroscopio
    const subscription = Gyroscope.addListener((data) => {
      setGyroscopeData(data);
    });

    // Configurar el intervalo de actualización a 100ms
    Gyroscope.setUpdateInterval(100);

    // Limpiar la suscripción al desmontar el componente
    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Datos del Giroscopio en Tiempo Real:</Text>
      <Text style={styles.gyroscopeText}>x: {gyroscopeData.x.toFixed(2)}</Text>
      <Text style={styles.gyroscopeText}>y: {gyroscopeData.y.toFixed(2)}</Text>
      <Text style={styles.gyroscopeText}>z: {gyroscopeData.z.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  gyroscopeText: {
    fontSize: 16,
    marginVertical: 4,
  },
});
