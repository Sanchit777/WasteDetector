// assets
import {
  AppstoreAddOutlined,
  AntDesignOutlined,
  BarcodeOutlined,
  StarOutlined,
  GiftOutlined,
  LoadingOutlined
} from '@ant-design/icons';

// icons
const icons = {
  GiftOutlined,
  StarOutlined,
  BarcodeOutlined,
  AntDesignOutlined,
  LoadingOutlined,
  AppstoreAddOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Utilities',
  type: 'group',
  children: [
    {
      id: 'util-color',
      title: 'LeaderBoard',
      type: 'item',
      url: '/leaderboard',
      icon: icons.StarOutlined
    },
    {
      id: 'util-typography',
      title: 'Rewards',
      type: 'item',
      url: '/upload',
      icon: icons.GiftOutlined
    },
  
    // {
    //   id: 'util-shadow',
    //   title: 'Shadow',
    //   type: 'item',
    //   url: '/shadow',
    //   icon: icons.BarcodeOutlined
    // }
  ]
};

export default utilities;
