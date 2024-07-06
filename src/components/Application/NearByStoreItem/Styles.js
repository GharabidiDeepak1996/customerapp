const Typography = AppConfig.typography.default;
const Fonts = AppConfig.fonts.default;
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import AppConfig from '../../../../branding/App_config';
//import { colors } from 'react-native-elements';
import colors from '../../../../branding/carter/styles/light/Colors';

const Styles = {
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  locationView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: 'white',
    // shadowColor: "#000000",
    // shadowOffset: {
    //   width: 0,
    //   height: 4,
    // },
    // shadowOpacity: 0.19,
    // shadowRadius: 5.62,
    // elevation: 6,
  },
  cartCount: {
    backgroundColor: 'red',
    borderRadius: 50,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    position: 'absolute',
    right: -5,
    top: -8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  searchView: {
    borderColor: '#ced4da',
    borderWidth: 2,
    borderRadius: 6,
    height: 50,
    padding: 8,
    flexDirection: 'row',
  },
  searchFilter: {
    flex: 1,
    alignItems: 'center',
    width: 30,
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  imageViewContainer: {
    //f2f2f2
    width: '100%',
    backgroundColor: '#f2f2f2',
    height: '29%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    justifyContent: 'center',
  },
  imageContainer: {
    //margin: 18,
    borderRadius: 18,
    height: '70%',
    width: '90%',
    alignSelf: 'center',
  },
  categoriesCards: {
    borderRadius: 8,
    width: 80,
    height: 80,
    backgroundColor: 'white',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.18,
    shadowRadius: 4.59,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    marginBottom: 16,
  },
  categoriesView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoriesTitle: {color: 'black', fontSize: 16, fontWeight: 'bold'},
  categoriesViewMore: {color: '#c23d32', fontSize: 16, fontWeight: 'bold'},
  categoriesCardsView: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bestsellerContainer: {
    // flexWrap: "wrap",
    //  backgroundColor: "white",
  },
  bestSellerCardView: {
    borderRadius: 10,
    width: 176,
    backgroundColor: 'white',
    shadowColor: 'white',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.18,
    shadowRadius: 4.59,
    elevation: 5,
    position: 'relative',
    marginRight: 14,
    paddingBottom: 0,
    borderColor: '#D4D4D4',
    borderWidth: 1,
  },
  bestsellerCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bestsellerImageContainer: {
    height: 150,
    width: '100%',
    paddingBottom: 0,
  },
  favouriteContainer: {
    width: '50%',
    paddingTop: wp(2),
    paddingEnd: wp(2),
    justifyContent: 'center',
    alignItems: 'flex-end',
    elevation: 3,
  },

  bestsellerImage: {
    height: '100%',
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  bestsellerPercentageContainer: {
    backgroundColor: '#c23d32',
    position: 'absolute',
    paddingVertical: 2,
    paddingHorizontal: 8,

    flexDirection: 'row',
    alignItems: 'center',
    borderTopLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  bestsellerPercentage: {
    color: 'white',
    justifyContent: 'center',
    marginRight: 3,
    fontSize: 12,
  },
  bestsellerText: {
    color: 'white',
    fontFamily: Fonts.RUBIK_MEDIUM,
    fontSize: 12,
    paddingVertical: 3,
  },
  bestsellerStarContainer: {
    backgroundColor: 'black',
    height: 15,
    width: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    marginRight: 2,
  },
  ratingText: {
    fontSize: Typography.P5,
    color: colors.headingColor,
    fontFamily: Fonts.RUBIK_MEDIUM,
    marginLeft: 2,
    marginRight: 6,
  },
  titleText: {
    fontSize: Typography.P3,
    fontFamily: Fonts.RUBIK_MEDIUM,
    color: colors.headingColor,
    marginVertical: hp('0.5'),
  },
  subText: {
    fontSize: Typography.P5,
    fontFamily: Fonts.RUBIK_REGULAR,
    color: colors.subHeadingColor,
    marginVertical: hp('0.2'),
    marginLeft: 6,
  },
};

export default Styles;
