import {
  emptyGermicule,
  unknownGermicule,
  lonelyGermicule,
  twinGermicule,
  linkGermicule,
  groupGermicule,
  emptyD3GraphInfo,
  unknownD3GraphInfo,
  lonelyD3GraphInfo,
  // twinD3GraphInfo,
  // linkD3GraphInfo,
  // groupD3GraphInfo,
} from './germicule.data';
import { GermiculeD3Translator } from '../GermiculeTranslator';

const COLORS = {
  background: '#fdf6e3',
  risks: new Map<number, string>([
    [0, '#859900'] /* green */,
    [1, '#2aa198'] /* cyan */,
    [2, '#268bd2'] /* blue */,
    [3, '#6c71c4'] /* violet */,
    [4, '#d33682'] /* magenta */,
    [5, '#dc322f'] /* red */,
  ]),
};

describe('GermiculeD3Translator.toGraphInfo', () => {
  it('should handle empty germicule data', () => {
    const translator: GermiculeD3Translator = new GermiculeD3Translator(COLORS);
    const result = translator.toGraphInfo({ connections: emptyGermicule });
    expect(Array.from(result.nodes.values())).toMatchObject(
      Array.from(emptyD3GraphInfo.nodes!.values()),
    );
  });
  it('should handle unknown germicule data', () => {
    const translator: GermiculeD3Translator = new GermiculeD3Translator(COLORS);
    const result = translator.toGraphInfo({ connections: unknownGermicule });
    expect(Array.from(result.nodes.values())).toMatchObject(
      Array.from(unknownD3GraphInfo.nodes!.values()),
    );
  });
  it('should handle lonely germicule data', () => {
    const translator: GermiculeD3Translator = new GermiculeD3Translator(COLORS);
    const result = translator.toGraphInfo({ connections: lonelyGermicule });
    expect(Array.from(result.nodes.values())).toMatchObject(
      Array.from(lonelyD3GraphInfo.nodes!.values()),
    );
  });
  // it('should handle twin germicule data', () => {
  //   const translator: GermiculeD3Translator = new GermiculeD3Translator(
  //     COLORS,
  //   );
  //   const result = translator.toGraphInfo({ connections: twinGermicule });
  //   expect(result).toMatchObject(twinD3GraphInfo);
  // });
  // it('should handle link germicule data', () => {
  //   const translator: GermiculeD3Translator = new GermiculeD3Translator(
  //     COLORS,
  //   );
  //   const result = translator.toGraphInfo({ connections: linkGermicule });
  //   expect(result).toMatchObject(linkD3GraphInfo);
  // });
  // it('should handle group germicule data', () => {
  //   const translator: GermiculeD3Translator = new GermiculeD3Translator(
  //     COLORS,
  //   );
  //   const result = translator.toGraphInfo({ connections: groupGermicule });
  //   expect(result).toMatchObject(groupD3GraphInfo);
  // });
});
