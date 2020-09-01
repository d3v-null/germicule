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
import {
  GermiculeD3Translator,
  DEFAULT_THEME as THEME,
} from '../GermiculeTranslator';
import { getDefaultSrc } from '../components/GermiculeEnvironment/GermiculeEnvironment';
import * as _ from 'lodash';

describe('GermiculeD3Translator.toGraphInfo', () => {
  it('should handle empty germicule data', () => {
    const translator: GermiculeD3Translator = new GermiculeD3Translator(THEME);
    const result = translator.toGraphInfo({ connections: emptyGermicule });
    expect(Array.from(result.nodes.values())).toMatchObject(
      Array.from(emptyD3GraphInfo.nodes!.values()),
    );
  });
  it('should handle unknown germicule data', () => {
    const translator: GermiculeD3Translator = new GermiculeD3Translator(THEME);
    const result = translator.toGraphInfo({ connections: unknownGermicule });
    expect(Array.from(result.nodes.values())).toMatchObject(
      Array.from(unknownD3GraphInfo.nodes!.values()),
    );
  });
  it('should handle lonely germicule data', () => {
    const translator: GermiculeD3Translator = new GermiculeD3Translator(THEME);
    const result = translator.toGraphInfo({ connections: lonelyGermicule });
    expect(Array.from(result.nodes.values())).toMatchObject(
      Array.from(lonelyD3GraphInfo.nodes!.values()),
    );
  });
  it('should handle default germicule data', () => {
    const translator: GermiculeD3Translator = new GermiculeD3Translator(THEME);
    const result = translator.toGraphInfo(getDefaultSrc());
    expect(_.isEmpty(Array.from(result.edges.values()))).toBe(true);
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
