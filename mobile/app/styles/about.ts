import { StyleSheet } from 'react-native';

const aboutCSS = StyleSheet.create({
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

export default aboutCSS;