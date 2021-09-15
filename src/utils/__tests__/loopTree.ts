import {
  loopDFS,
} from '../loopTree';


const NODES_1 = [
  {
    value: '0',
    children: [
      {
        value: '0-1',
        children: [
          {
            value: '0-1-1',
          },
          {
            value: '0-1-2',
            children: [
              {
                value: '0-1-2-1',
                children: [
                  {
                    value: '0-1-2-1-1',
                    children: [
                      {
                        value: '0-1-2-1-1-1',
                      }
                    ]
                  },
                  {
                    value: '0-1-2-1-2',
                  }
                ]
              }
            ]
          },
          {
            value: '0-1-3',
          }
        ]
      },
      {
        value: '0-2',
      },
    ]
  },
  {
    value: '1',
    children: [
      {
        value: '1-1',
        children: [
          {
            value: '1-1-1',
            children: [
              {
                value: '1-1-1-1',
              }
            ]
          },
          {
            value: '1-1-2',
            children: [
              {
                value: '1-1-2-1',
              }
            ]
          }
        ]
      },
      {
        value: '1-2',
        children: [
          {
            value: '1-2-1',
            children: [
              {
                value: '1-2-1-1',
                children: [
                  {
                    value: '1-2-1-1-1',
                  }
                ]
              }
            ]
          }
        ]
      },
    ]
  }
];


test('loopDFS: expect loop DFS', () => {

  function checkValue(n: number) {
    switch (n) {
      case 0: return '0';
      case 1: return '0-1';
      case 2: return '0-1-1';
      case 3: return '0-1-2';
      case 4: return '0-1-2-1';
      case 5: return '0-1-2-1-1';
      case 6: return '0-1-2-1-1-1';
      case 7: return '0-1-2-1-2';
      case 8: return '0-1-3';
      case 9: return '0-2';
      case 10: return '1';
      case 11: return '1-1';
      case 12: return '1-1-1';
      case 13: return '1-1-1-1';
      case 14: return '1-1-2';
      case 15: return '1-1-2-1';
      case 16: return '1-2';
      case 17: return '1-2-1';
      case 18: return '1-2-1-1';
      case 19: return '1-2-1-1-1';
    }
  }

  loopDFS(NODES_1, (node: {value: string}, i: number) => {
    expect(checkValue(i)).toBe(node.value);
  });
});

