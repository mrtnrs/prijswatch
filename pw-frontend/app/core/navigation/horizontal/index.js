const navigation = () => {
  return [
    {
      icon: 'mdi:projector',
      title: 'Beeld & video',
      children: [
        {
          title: 'Video',
          icon: 'mdi:record-rec',
          path: '/apps/email',
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
          title: 'TV & projector',
          icon: 'mdi:projector-screen-outline',
          path: '/apps/chat',
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
        }
      ]
    },
    {
      icon: 'mdi:speaker-wireless',
      title: 'Audio',
      children: [
        {
          title: 'Speakers',
          icon: 'mdi:speaker',
          path: '/apps/email'
        },
        {
          title: 'Koptelefoons',
          icon: 'mdi:headphones',
          path: '/apps/chat'
        },
        {
          title: 'Oortjes',
          icon: 'mdi:earbuds-outline',
          children: [
            {
              title: 'Draadloos',
              path: '/apps/invoice/list'
            },
            {
              title: 'Met draad',
              path: '/apps/invoice/preview'
            }
          ]
        },
        {
          title: 'Soundbars',
          icon: 'mdi:soundbar',
          path: '/apps/chat'
        }
      ]
    },
    {
      icon: 'mdi:controller',
      title: 'Gaming',
      path: '/gaming/',
      children: [
        {
          title: 'Console',
          icon: 'mdi:credit-card-outline',
          path: '/gaming/console',
          children: [
            {
              title: 'Playstation',
              icon: 'mdi:sony-playstation',
              path: '/gaming/console/playstation'
            },
            {
              title: 'Xbox',
              icon: 'mdi:microsoft-xbox',
              path: '/ui/cards/advanced'
            },
            {
              title: 'Wii',
              icon: 'mdi:nintendo-wii',
              path: '/ui/cards/statistics'
            },
          ]
        },
                {
          title: 'VR',
          icon: 'mdi:safety-goggles',
          path: '/gaming/vr'
        },
        {
          title: 'Gaming accessoires',
          path: '/ui/headset-dock',
          icon: 'mdi:headset-dock'
        }
      ]
    },
    {
      icon: 'mdi:devices',
      title: 'Smarthpones & Tablets',
      children: [
        {
          title: 'Smarthpones',
          path: '/ui/headset-dock',
          icon: 'mdi:card-account-details-outline'
        },
        {
          icon: 'mdi:account-cog-outline',
          path: '/ui/headset-dock',
          title: 'Tablets'
        },
        {
          title: 'Wearables',
          path: '/pages/faq',
          icon: 'mdi:help-circle-outline'
        }
      ]
    },
    {
      title: 'Computers',
      icon: 'mdi:laptop',
      children: [
        {
          title: 'Laptops',
          icon: 'mdi:form-select',
          path: '/forms/form-layouts'
        },
        {
          icon: 'mdi:cube-outline',
          title: 'Desktops',
          path: '/forms/form-layouts'
        },
        {
          title: 'Computeraccessoires',
          path: '/forms/form-validation',
          icon: 'mdi:checkbox-marked-circle-outline'
        }
      ]
    },
    {
      title: 'Huishouden',
      icon: 'mdi:sofa-single-outline',
      children: [
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
        }
      ]
    },
    {
      title: 'Meer',
      icon: 'mdi:dots-horizontal',
      children: [
        {
          path: '/acl',
          action: 'read',
          subject: 'acl-page',
          icon: 'mdi:shield-outline',
          title: 'Access Control'
        },
        {
          title: 'Menu Levels',
          icon: 'mdi:menu',
          children: [
            {
              title: 'Menu Level 2.1'
            },
            {
              title: 'Menu Level 2.2',
              children: [
                {
                  title: 'Menu Level 3.1'
                },
                {
                  title: 'Menu Level 3.2'
                }
              ]
            }
          ]
        },
        {
          title: 'Disabled Menu',
          icon: 'mdi:eye-off-outline',
          disabled: true
        },
        {
          title: 'Raise Support',
          icon: 'mdi:lifebuoy',
          externalLink: true,
          openInNewTab: true,
          path: 'https://pixinvent.ticksy.com/'
        },
        {
          title: 'Documentation',
          icon: 'mdi:file-document-outline',
          externalLink: true,
          openInNewTab: true,
          path: 'https://pixinvent.com/demo/materialize-mui-react-nextjs-admin-template/documentation'
        }
      ]
    }
  ]
}

export default navigation
