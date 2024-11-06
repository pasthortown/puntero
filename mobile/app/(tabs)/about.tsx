import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Icon size={300} name="mouse-pointer" style={styles.headerImage} />}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Acerca de LSPresenter</ThemedText>
      </ThemedView>
      <ThemedText style={styles.descriptionText}>
        Esta aplicación es una herramienta avanzada para facilitar el control de presentaciones, 
        diseñada para simplificar la interacción durante exposiciones o reuniones. Con ella, puedes 
        navegar por las diapositivas de manera intuitiva, avanzando o retrocediendo con un solo toque, 
        además de iniciar o detener la presentación según sea necesario.
      </ThemedText>
      <ThemedText style={styles.descriptionText}>
        La funcionalidad más innovadora es el control del puntero del ratón de la computadora: 
        simplemente apunta tu teléfono en la dirección deseada para mover el puntero en tiempo real. 
        Esta característica convierte al teléfono en un mando dinámico, permitiendo al presentador 
        interactuar con los contenidos de forma fluida y profesional sin necesidad de estar junto al equipo.
      </ThemedText>
      
      <ThemedView style={styles.featureListContainer}>
        <ThemedText type="title">Características:</ThemedText>
        <ThemedText style={styles.featureItem}>• Control remoto de las diapositivas: avanza o retrocede con facilidad.</ThemedText>
        <ThemedText style={styles.featureItem}>• Inicio y detención de presentaciones con un toque.</ThemedText>
        <ThemedText style={styles.featureItem}>• Control del puntero del ratón utilizando los movimientos del teléfono.</ThemedText>
      </ThemedView>

      <ThemedView style={styles.footerContainer}>
        <ThemedText style={styles.footerText}>Esta aplicación, LSPresenter, ha sido desarrollada por Luis Alfonso Salazar Vaca - 2024.</ThemedText>
        <ThemedText style={styles.footerText}> <Icon name="copyright" size={15} color="#808080" /> Todos los derechos reservados.</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: 0,
    left: -25,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 16,
    paddingHorizontal: 20,
    marginVertical: 10,
    color: '#606060',
    textAlign: 'justify',
  },
  featureListContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  featureItem: {
    fontSize: 16,
    color: '#606060',
    marginVertical: 5,
    textAlign: 'justify',
  },
  footerContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#808080',
    textAlign: 'center',
  },
});
