import React, { useEffect, useState, useRef } from 'react';
import { View, TouchableOpacity, TextInput, Dimensions, Animated, LogBox, Alert } from 'react-native';
import { Gyroscope } from 'expo-sensors';
import WebSocketService from './../services/WebSocketService';
import WebService from './../services/WebService';
import Icon from 'react-native-vector-icons/FontAwesome';
import indexCSS from './../styles/index';

LogBox.ignoreAllLogs();

export default function GyroscopeScreen() {
  const [gyroscopeData, setGyroscopeData] = useState({ x: 0, y: 0, z: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [initialRotation, setInitialRotation] = useState({ x: 0, y: 0, z: 0 });
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [presentando, setPresentando] = useState(false);
  const [conected, setConected] = useState(false);
  const rotationRef = useRef(rotation);
  const webSocketService = useRef(new WebSocketService(setConected));

  const [ip, setIp] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [expanded, setExpanded] = useState(false);
  const slideAnim = useState(new Animated.Value(0))[0];

  const maxSlideWidth = Dimensions.get('window').width;

  useEffect(() => {
    let lastTimestamp = Date.now();

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
    };
  }, [isMeasuring]);

  const handlePresentButtonPress = async () => {
    if (!conected) return;
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
    if (!conected) return;
    let action;
    if (presentando) {
      action = buttonName;
    } else {
      action = buttonName === 'siguiente' ? 'click' : 'secondary_click';
    }
    await WebService.sendButtonAction(action);
  };

  const formatIpAddress = (text: string) => {
    let cleaned = text.replace(/[^\d.]/g, ''); 
    let segments = cleaned.split('.'); 
    segments = segments.map(segment => segment.slice(0, 3)).slice(0, 4); 
    return segments.join('.');
  };

  const isValidIpAddress = (ip: string) => {
    const regex = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
    return regex.test(ip);
  };

  const handleSave = () => {
    if (isValidIpAddress(inputValue)) {
      setIp(inputValue);
      webSocketService.current.connect(inputValue);
      WebService.setBaseURL(inputValue);
      toggleExpand();
    } else {
      Alert.alert('Dirección IP inválida', 'Por favor, ingresa una dirección IPv4 válida.');
    }
  };

  const toggleExpand = () => {
    if (expanded) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setExpanded(false));
    } else {
      setExpanded(true);
      Animated.timing(slideAnim, {
        toValue: maxSlideWidth,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const getToggleButtonColor = () => {
    if (ip === '') return '#ffffff';
    return conected ? 'rgb(78,167,46)' : 'rgb(194,20,20)';
  };

  return (
    <View style={indexCSS.container}>
      <TouchableOpacity style={indexCSS.presentButton} onPress={handlePresentButtonPress}>
        <Icon name={presentando ? 'stop' : 'play'} size={30} color="#ffffff" />
      </TouchableOpacity>

      <TouchableOpacity style={indexCSS.highlightButton} onPressIn={startMeasuring} onPressOut={stopMeasuring}>
        <Icon name="mouse-pointer" size={30} color="#ffffff" />
      </TouchableOpacity>

      <View style={indexCSS.bottomButtonContainer}>
        <TouchableOpacity style={indexCSS.bottomButton} onPress={() => handleButtonPress('siguiente')}>
          <Icon name={presentando ? 'plus' : 'hand-pointer-o'} size={30} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity style={indexCSS.bottomButton} onPress={() => handleButtonPress('anterior')}>
          <Icon name={presentando ? 'minus' : 'hand-peace-o'} size={30} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <Animated.View style={[indexCSS.slideContainer, { width: slideAnim }]}>
        {expanded && (
          <View style={indexCSS.inputGroup}>
            <TextInput
              style={indexCSS.input}
              placeholder="Server IP"
              value={inputValue}
              keyboardType="numeric"
              onChangeText={(text) => {
                const formatted = formatIpAddress(text);
                setInputValue(formatted);
              }}
            />
            <TouchableOpacity style={indexCSS.saveButton} onPress={handleSave}>
              <Icon name="save" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
      
      <Animated.View style={[indexCSS.toggleButton, { transform: [{ translateX: slideAnim }] }]}>
        <TouchableOpacity onPress={toggleExpand}>
          <Icon name={expanded ? 'chevron-right' : 'chevron-left'} size={20} color={getToggleButtonColor()} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}