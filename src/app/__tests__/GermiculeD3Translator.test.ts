import {
  emptyGermicule,
  unknownGermicule,
  lonelyGermicule,
  twinGermicule,
  linkGermicule,
  clusterGermicule,
  emptyD3GraphInfo,
  unknownD3GraphInfo,
  lonelyD3GraphInfo,
  // twinD3GraphInfo,
  // linkD3GraphInfo,
  // clusterD3GraphInfo,
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
    const result = translator.toGraphInfo({ germicules: emptyGermicule });
    expect(result).toMatchObject(emptyD3GraphInfo);
  });
  it('should handle unknown germicule data', () => {
    const translator: GermiculeD3Translator = new GermiculeD3Translator(COLORS);
    const result = translator.toGraphInfo({ germicules: unknownGermicule });
    expect(result).toMatchObject(unknownD3GraphInfo);
  });
  it('should handle lonely germicule data', () => {
    const translator: GermiculeD3Translator = new GermiculeD3Translator(COLORS);
    const result = translator.toGraphInfo({ germicules: lonelyGermicule });
    expect(result).toMatchObject(lonelyD3GraphInfo);
  });
  // it('should handle twin germicule data', () => {
  //   const translator: GermiculeD3Translator = new GermiculeD3Translator(
  //     COLORS,
  //   );
  //   const result = translator.toGraphInfo({ germicules: twinGermicule });
  //   expect(result).toMatchObject(twinD3GraphInfo);
  // });
  // it('should handle link germicule data', () => {
  //   const translator: GermiculeD3Translator = new GermiculeD3Translator(
  //     COLORS,
  //   );
  //   const result = translator.toGraphInfo({ germicules: linkGermicule });
  //   expect(result).toMatchObject(linkD3GraphInfo);
  // });
  // it('should handle cluster germicule data', () => {
  //   const translator: GermiculeD3Translator = new GermiculeD3Translator(
  //     COLORS,
  //   );
  //   const result = translator.toGraphInfo({ germicules: clusterGermicule });
  //   expect(result).toMatchObject(clusterD3GraphInfo);
  // });
});
