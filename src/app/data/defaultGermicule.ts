export default {
  version: '0.2',
  groups: [
    {
      name: 'Lygon',
      location: '',
    },
  ],
  connections: [
    {
      name: '👨‍🎤',
      entityValue: 2,
      connections: [
        {
          name: '🐺',
          entityValue: 2,
          connectionValue: 1,
          connectionDescription: 'Ex-housemate',
          group: 'Lygon',
          connections: [
            {
              name: '🐭',
              entityValue: 1,
              connectionValue: null,
              connections: [null],
            },
            {
              name: '🐶',
              entityValue: 1,
              connectionValue: null,
              connections: [null],
            },
          ],
        },
        {
          name: '☕',
          entityValue: null,
          connectionValue: 1,
          connectionDescription: 'Ex-housemate',
          group: 'Lygon',
          connections: [
            {
              name: '😿',
              entityValue: 1.5,
              connectionValue: 0,
              connectionDescription: 'Partner',
              group: 'Union',
              connections: [
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
                  connections: [null],
                },
              ],
            },
            null,
          ],
        },
        {
          link: '😿',
          connectionValue: 5,
          connectionDescription: 'Best friend',
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
              connections: [null],
            },
            {
              link: '😿',
              connectionValue: null,
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
          name: '🌳',
          entityValue: 2,
          connectionValue: 1,
          connectionDescription: 'Housemate,',
          group: 'Kewties',
          connections: [
            {
              name: '🍎',
              entityValue: 3,
            },
          ],
        },
        {
          name: '🐈',
          entityValue: 1.1,
          connectionValue: 1,
          connectionDescription: 'Potential Housemate',
          group: 'Kewties',
          connections: [
            {
              link: '👓',
              connectionValue: 0,
            },
          ],
        },
        {
          name: '👓',
          connectionValue: 1,
          dscription: 'Potential Housemate',
          group: 'Kewties',
        },
      ],
    },
  ],
};
