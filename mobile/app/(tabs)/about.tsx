import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Icon from 'react-native-vector-icons/FontAwesome';
import aboutCSS from './../styles/about';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Icon size={300} name="mouse-pointer" style={aboutCSS.headerImage} />}
    >
      <ThemedView style={aboutCSS.titleContainer}>
        <ThemedText type="title">Acerca de LSPresenter</ThemedText>
      </ThemedView>
      <ThemedText style={aboutCSS.descriptionText}>
        Esta aplicación es una herramienta avanzada para facilitar el control de presentaciones, 
        diseñada para simplificar la interacción durante exposiciones o reuniones. Con ella, puedes 
        navegar por las diapositivas de manera intuitiva, avanzando o retrocediendo con un solo toque, 
        además de iniciar o detener la presentación según sea necesario.
      </ThemedText>
      <ThemedText style={aboutCSS.descriptionText}>
        La funcionalidad más innovadora es el control del puntero del ratón de la computadora: 
        simplemente apunta tu teléfono en la dirección deseada para mover el puntero en tiempo real. 
        Esta característica convierte al teléfono en un mando dinámico, permitiendo al presentador 
        interactuar con los contenidos de forma fluida y profesional sin necesidad de estar junto al equipo.
      </ThemedText>
      
      <ThemedView style={aboutCSS.featureListContainer}>
        <ThemedText type="title">Características:</ThemedText>
        <ThemedText style={aboutCSS.featureItem}>• Control remoto de las diapositivas: avanza o retrocede con facilidad.</ThemedText>
        <ThemedText style={aboutCSS.featureItem}>• Inicio y detención de presentaciones con un toque.</ThemedText>
        <ThemedText style={aboutCSS.featureItem}>• Control del puntero del ratón utilizando los movimientos del teléfono.</ThemedText>
      </ThemedView>

      <ThemedView style={aboutCSS.footerContainer}>
        <ThemedText style={aboutCSS.footerText}>Esta aplicación, LSPresenter, ha sido desarrollada por Luis Alfonso Salazar Vaca - 2024.</ThemedText>
        <ThemedText style={aboutCSS.footerText}> <Icon name="copyright" size={15} color="#808080" /> Todos los derechos reservados.</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}
