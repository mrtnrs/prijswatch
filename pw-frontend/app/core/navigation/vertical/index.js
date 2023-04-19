const navigation = () => {
  return [
    {
      title: 'Home',
      icon: 'mdi:home-outline',
      path: '/'
    },
    {
      sectionTitle: 'Beeld & video'
    },
    {
      title: 'Video',
      icon: 'mdi:record-rec',
      children: [
            {
              title: "Action camera's",
              icon: 'mdi:camera-gopro',
              path: '/apps/invoice/list'
            },
            {
              title: 'Drones',
              icon: 'mdi:quadcopter',
              path: '/apps/invoice/preview'
            }
          ]
    },
    {
      title: 'TV & Projector',
      icon: 'mdi:projector-screen-outline',
          children: [
            {
              title: 'Televisies',
              icon: 'mdi:television',
              path: '/apps/invoice/list'
            },
            {
              title: 'Projectors',
              icon: 'mdi:projector',
              path: '/apps/invoice/preview'
            },
            {
              title: 'Monitors',
              icon: 'mdi:monitor-screenshot',
              path: '/apps/invoice/preview'
            }
          ]
    },
    {
      title: 'Fotografie',
      icon: 'mdi:panorama-outline',
          children: [
            {
              title: "Camera's",
              icon: 'mdi:camera',
              path: '/apps/invoice/list'
            },
            {
              title: 'Lenzen',
              icon: 'mdi:camera-iris',
              path: '/apps/invoice/preview'
            }
          ]
    },
    {
      sectionTitle: 'Audio'
    },
    {
      title: 'Speakers',
      icon: 'mdi:speaker',
      children: [
        {
          title: 'User Profile',
          children: [
            {
              title: 'Profile',
              path: '/pages/user-profile/profile'
            },
            {
              title: 'Teams',
              path: '/pages/user-profile/teams'
            },
            {
              title: 'Projects',
              path: '/pages/user-profile/projects'
            },
            {
              title: 'Connections',
              path: '/pages/user-profile/connections'
            }
          ]
        },
        {
          title: 'FAQ',
          path: '/pages/faq'
        },
        {
          title: 'Help Center',
          path: '/pages/help-center'
        },
        {
          title: 'Pricing',
          path: '/pages/pricing'
        },
        {
          title: 'Miscellaneous',
          children: [
            {
              openInNewTab: true,
              title: 'Coming Soon',
              path: '/pages/misc/coming-soon'
            },
            {
              openInNewTab: true,
              title: 'Under Maintenance',
              path: '/pages/misc/under-maintenance'
            },
            {
              openInNewTab: true,
              title: 'Page Not Found - 404',
              path: '/pages/misc/404-not-found'
            },
            {
              openInNewTab: true,
              title: 'Not Authorized - 401',
              path: '/pages/misc/401-not-authorized'
            },
            {
              openInNewTab: true,
              title: 'Server Error - 500',
              path: '/pages/misc/500-server-error'
            }
          ]
        }
      ]
    },
    {
          title: 'Koptelefoons',
          icon: 'mdi:headphones',
          children: [
            {
              title: 'Account',
              path: '/pages/account-settings/account'
            },
            {
              title: 'Security',
              path: '/pages/account-settings/security'
            },
            {
              title: 'Billing',
              path: '/pages/account-settings/billing'
            },
            {
              title: 'Notifications',
              path: '/pages/account-settings/notifications'
            },
            {
              title: 'Connections',
              path: '/pages/account-settings/connections'
            }
          ]
        },
                {
          title: 'Oortjes',
          icon: 'mdi:earbuds-outline',
          children: [
            {
              title: 'Draadloos',
              icon: 'mdi:cellphone-wireless',
              path: '/cellphone-wireless'
            },
            {
              title: 'Met draad',
              icon: 'mdi:sine-wave',
              path: '/pages/account-settings/security'
            }
          ]
        },
    {
      title: 'Soundbars',
      path: '/soundbars',
      icon: 'mdi:soundbar'
    },
    {
      sectionTitle: 'Gaming'
    },
    {
      title: 'Console',
      icon: 'mdi:controller-classic',
      path: '/ui/typography'
    },
    {
      title: 'VR',
      path: '/ui/icons',
      icon: 'mdi:safety-goggles'
    },
    {
      title: 'Gaming accessoires',
      icon: 'mdi:headset-dock',
      path: '/hello'
    },
    {
      sectionTitle: 'Smarthpones & Tablets'
    },
    {
      title: 'Smarthpones',
      icon: 'mdi:cellphone',
      path: '/hello'
    },
    {
      icon: 'mdi:tablet-dashboard',
      title: 'Tablets',
      path: '/forms/form-layouts'
    },
    {
      title: 'Wearables',
      path: '/forms/form-validation',
      icon: 'mdi:watch-variant'
    },{
      sectionTitle: 'Computers'
    },
    {
      title: 'Laptops',
      icon: 'mdi:laptop',
      path: '/hello'
    },
    {
      path: '/acl',
      subject: 'acl-page',
      icon: 'mdi:desktop-tower-monitor',
      title: 'Desktops'
    },    {
      path: '/acl',
      subject: 'acl-page',
      icon: 'mdi:router-wireless',
      title: 'Computeraccessoires'
    },{
      sectionTitle: 'Huishouden'
    },
        {
          title: 'Smart Home',
          icon: 'mdi:lock-smart',
          path: '/charts/apex-charts',
          children: [
            {
              path: '/acl',
              subject: 'acl-page',
              icon: 'mdi:cctv',
              title: 'Veiligheid'
            },
            {
              path: '/acl',
              subject: 'acl-page',
              icon: 'mdi:doorbell',
              title: 'Deurbellen'
            }
          ]
        },
        {
          title: 'Keuken',
          icon: 'mdi:chef-hat',
          path: '/charts/recharts',
          children: [
            {
              path: '/acl',
              subject: 'acl-page',
              icon: 'mdi:coffee-maker-outline',
              title: 'Koffiemachines'
            },
            {
              path: '/acl',
              subject: 'acl-page',
              icon: 'mdi:blender',
              title: 'Keukenapparaten'
            }
          ]
        },
        {
          title: 'Huishouden',
          path: '/charts/chartjs',
          icon: 'mdi:vacuum-outline',
          children: [
            {
              path: '/acl',
              subject: 'acl-page',
              icon: 'mdi:robot-vacuum',
              title: 'Stofzuigers'
            },
            {
              path: '/acl',
              subject: 'acl-page',
              icon: 'mdi:air-conditioner',
              title: 'Airco'
            }
          ]
    },
    {
      title: 'Meer',
      icon: 'mdi:dots-horizontal',
      children: [
        {
          title: 'Contact',
          path: '/contact'
        }
      ]
    }
  ]
}

export default navigation
