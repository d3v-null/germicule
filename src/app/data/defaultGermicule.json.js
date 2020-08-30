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
      risk: 2,
      connections: [
        {
          name: '🐺',
          risk: 2,
          contact: 1,
          description: 'Ex-housemate',
          group: 'Lygon',
          connections: [
            {
              name: '🐭',
              risk: 1,
              contact: null,
              connections: [null],
            },
            {
              name: '🐶',
              risk: 1,
              contact: null,
              connections: [null],
            },
          ],
        },
        {
          name: '☕',
          risk: null,
          contact: 1,
          description: 'Ex-housemate',
          group: 'Lygon',
          connections: [
            {
              name: '😿',
              risk: 1.5,
              contact: 0,
              description: 'Partner',
              group: 'Union',
              connections: [
                {
                  name: '🦕',
                  risk: null,
                  contact: 1,
                  description: 'Housemate',
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
          contact: 5,
          description: 'Best friend',
        },
        {
          name: '🔥',
          risk: 1.5,
          contact: 1,
          description: 'Housemate',
          group: 'Kewties',
          connections: [
            {
              name: '🔮',
              risk: 1.5,
              contact: 2.3,
              description: 'Partner',
              connections: [null],
            },
            {
              link: '😿',
              contact: null,
            },
          ],
        },
        {
          name: '🍑',
          risk: 1.2,
          contact: 1,
          description: 'Housemate',
          group: 'Kewties',
        },
        {
          name: '👷',
          risk: 1.5,
          contact: 1,
          description: 'Housemate',
          group: 'Kewties',
        },
        {
          name: '🌳',
          risk: 2,
          contact: 1,
          description: 'Housemate,',
          group: 'Kewties',
          connections: [
            {
              name: '🍎',
              risk: 3,
            },
          ],
        },
        {
          name: '🐈',
          risk: 1.1,
          contact: 1,
          description: 'Potential Housemate',
          group: 'Kewties',
          connections: [
            {
              link: '👓',
              contact: 0,
            },
          ],
        },
        {
          name: '👓',
          contact: 1,
          dscription: 'Potential Housemate',
          group: 'Kewties',
        },
      ],
    },
  ],
};
