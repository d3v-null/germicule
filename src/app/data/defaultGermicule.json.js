export default {
  version: '0.2',
  clusters: [
    {
      name: 'Lygon',
      location: '',
    },
  ],
  germicules: [
    {
      name: '👨‍🎤',
      risk: 2,
      germicule: [
        {
          name: '🐺',
          risk: 2,
          contact: 1,
          description: 'Ex-housemate',
          cluster: 'Lygon',
          germicule: [
            {
              name: '🐭',
              risk: 1,
              contact: null,
              germicule: [null],
            },
            {
              name: '🐶',
              risk: 1,
              contact: null,
              germicule: [null],
            },
          ],
        },
        {
          name: '☕',
          risk: null,
          contact: 1,
          description: 'Ex-housemate',
          cluster: 'Lygon',
          germicule: [
            {
              name: '😿',
              risk: 1.5,
              contact: 0,
              description: 'Partner',
              cluster: 'Union',
              germicule: [
                {
                  name: '🦕',
                  risk: null,
                  contact: 1,
                  description: 'Housemate',
                  cluster: 'Union',
                  germicule: [null],
                },
                {
                  name: '🔧',
                  cluster: 'Union',
                  germicule: [null],
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
          cluster: 'Kewties',
          germicule: [
            {
              name: '🔮',
              risk: 1.5,
              contact: 2.3,
              description: 'Partner',
              germicule: [null],
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
          cluster: 'Kewties',
        },
        {
          name: '👷',
          risk: 1.5,
          contact: 1,
          description: 'Housemate',
          cluster: 'Kewties',
        },
        {
          name: '🌳',
          risk: 2,
          contact: 1,
          description: 'Housemate,',
          cluster: 'Kewties',
          germicule: [
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
          cluster: 'Kewties',
          germicule: [
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
          cluster: 'Kewties',
        },
      ],
    },
  ],
};
