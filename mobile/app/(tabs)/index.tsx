import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Gyroscope } from 'expo-sensors';
import WebSocketService from './../services/WebSocketService';
import WebService from './../services/WebService';
import { LogBox } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

LogBox.ignoreAllLogs();

export default function GyroscopeScreen() {
  const [gyroscopeData, setGyroscopeData] = useState({ x: 0, y: 0, z: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [initialRotation, setInitialRotation] = useState({ x: 0, y: 0, z: 0 });
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [presentando, setPresentando] = useState(false);
  const rotationRef = useRef(rotation);
  const webSocketService = useRef(new WebSocketService());

  useEffect(() => {
    let lastTimestamp = Date.now();
    webSocketService.current.connect();

    const subscription = Gyroscope.addListener((data) => {
      const currentTime = Date.now();
      const deltaTime = (currentTime - lastTimestamp) / 1000;

      if (isMeasuring) {
        const newRotation = {
          x: rotationRef.current.x + data.x * deltaTime * (180 / Math.PI),
          y: rotationRef.current.y + data.y * deltaTime * (180 / Math.PI),
          z: rotationRef.current.z + data.z * deltaTime * (180 / Math.PI),
        };
        
        setRotation(newRotation);
        rotationRef.current = newRotation;

        webSocketService.current.sendData({
          x: newRotation.x - initialRotation.x,
          y: newRotation.y - initialRotation.y,
          z: newRotation.z - initialRotation.z,
        });
      }

      setGyroscopeData(data);
      lastTimestamp = currentTime;
    });

    Gyroscope.setUpdateInterval(100);

    return () => {
      subscription.remove();
      webSocketService.current.disconnect();
    };
  }, [isMeasuring]);

  const handlePresentButtonPress = async () => {
    const action = presentando ? 'apagar' : 'presentar';
    await WebService.sendButtonAction(action);
    setPresentando(!presentando);
  };

  const startMeasuring = () => {
    setIsMeasuring(true);
    setInitialRotation(rotation);
  };

  const stopMeasuring = () => {
    setIsMeasuring(false);
    setRotation({ x: 0, y: 0, z: 0 });
  };

  const handleButtonPress = async (buttonName: string) => {
    await WebService.sendButtonAction(buttonName);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.presentButton} onPress={handlePresentButtonPress}>
        <Icon name={presentando ? 'stop' : 'play'} size={30} color="#ffffff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.highlightButton} onPressIn={startMeasuring} onPressOut={stopMeasuring}>
        <Icon name="mouse-pointer" size={30} color="#ffffff" />
      </TouchableOpacity>
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity style={styles.bottomButton} onPress={() => handleButtonPress('siguiente')}>
          <Icon name="chevron-circle-left" size={30} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton} onPress={() => handleButtonPress('anterior')}>
          <Icon name="chevron-circle-right" size={30} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(80, 80, 80)',
  },
  presentButton: {
    position: 'absolute',
    top: 40,
    height: height * 0.20,
    width: '90%',
    backgroundColor: 'rgb(50, 50, 50)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderColor: 'rgb(50, 50, 50)',
    borderWidth: 1,
    marginHorizontal: 20,
  },
  highlightButton: {
    height: height * 0.45,
    width: '90%',
    backgroundColor: 'rgb(50, 50, 50)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderColor: 'rgb(50, 50, 50)',
    borderWidth: 1,
    marginTop: 20,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  bottomButton: {
    width: (width * 0.5) - (width * 0.5 * 0.2),
    height: height * 0.2,
    backgroundColor: 'rgb(50, 50, 50)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderColor: 'rgb(50, 50, 50)',
    borderWidth: 1,
  },
});
