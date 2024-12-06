// material-ui
import { useTheme } from '@mui/material/styles';
import AveryMeetLogo from '../../assets/images/logos/waste_segrator.png'

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
  const theme = useTheme();

  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     * <img src={logo} alt="Mantis" width="100" />
     *
     */
    <>
      <img src={AveryMeetLogo} alt="" width={190} height = {70} />
    </>
  );
};

export default Logo;
