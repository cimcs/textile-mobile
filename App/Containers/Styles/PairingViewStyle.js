import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors } from '../../Themes'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
  },
  key: {
    marginBottom: 14, alignSelf: 'center', fontSize: 8, fontFamily: 'BentonSans'
  },
  status: {
    padding: 30, marginBottom: 20, alignSelf: 'center', fontFamily: 'BentonSans', fontSize: 28, textAlign: 'justify'
  },
  message: {
    padding: 30, marginBottom: 20, alignSelf: 'center', fontFamily: 'BentonSans', fontSize: 12, textAlign: 'justify'
  },
  error: {
    padding: 30, marginBottom: 20, alignSelf: 'center', fontFamily: 'BentonSans', fontSize: 12, textAlign: 'left'
  },
  button: {
    fontFamily: 'BentonSans',
    color: Colors.charcoal,
    fontSize: 18,
    alignSelf: 'center',
    textAlign: 'justify'
  },
  buttonMargin: {
    backgroundColor: 'transparent', height: 22
  }
})
