import { GermiculeMeta } from '../../types/Germicule';
export default {
  version: '0.3',
  groups: [
    {
      name: 'Lygon',
      location: '',
    },
  ],
  nodes: [],
  connections: [
    {
      name: '👨‍🎤',
      entityValue: 2,
      connections: [
        {
          name: '😿',
          entityValue: 1.5,
          connectionValue: 30,
          connectionDescription: 'Best Friend',
          group: 'Union',
          connections: [
            {
              name: '☕',
              entityValue: null,
              connectionValue: 0,
              connectionDescription: 'Partner',
              group: 'Lygon',
              connections: [
                {
                  name: '🐺',
                  entityValue: 2,
                  connectionValue: 1,
                  connectionDescription: 'Housemate',
                  group: 'Lygon',
                  connections: [
                    {
                      name: '🐭',
                      entityValue: 1,
                      connectionValue: null,
                    },
                    {
                      name: '🐶',
                      entityValue: 1,
                      connectionValue: null,
                    },
                  ],
                },
              ],
            },
            {
              name: '🦕',
              entityValue: null,
              connectionValue: 1,
              connectionDescription: 'Housemate',
              group: 'Union',
              connections: [null],
            },
            {
              name: '🔧',
              group: 'Union',
              connectionValue: 1,
              connectionDescription: 'Housemate',
              connections: [null],
            },
          ],
        },
        {
          name: '🔥',
          entityValue: 1.5,
          connectionValue: 1,
          connectionDescription: 'Housemate',
          group: 'Kewties',
          connections: [
            {
              name: '🔮',
              entityValue: 1.5,
              connectionValue: 2.3,
              connectionDescription: 'Partner',
            },
          ],
        },
        {
          name: '🍑',
          entityValue: 1.2,
          connectionValue: 1,
          connectionDescription: 'Housemate',
          group: 'Kewties',
        },
        {
          name: '👷',
          entityValue: 1.5,
          connectionValue: 1,
          connectionDescription: 'Housemate',
          group: 'Kewties',
        },
        {
          name: '🐈',
          entityValue: 1.1,
          connectionValue: 1,
          connectionDescription: 'Housemate',
          group: 'Kewties',
          connections: [
            {
              link: '👓',
              description: 'Partner',
              connectionValue: 0,
            },
          ],
        },
        {
          name: '👓',
          connectionValue: 1,
          entityValue: 1.1,
          dscription: 'Housemate',
          group: 'Kewties',
        },
      ],
    },
  ],
} as GermiculeMeta;
