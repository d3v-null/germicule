import {
  emptyGermicule,
  unknownGermicule,
  lonelyGermicule,
  twinGermicule,
  linkGermicule,
  clusterGermicule,
  emptyGraphInfo,
  unknownGraphInfo,
  lonelyGraphInfo,
  twinGraphInfo,
  linkGraphInfo,
  clusterGraphInfo,
} from './germicule.data';
import { GermiculeTranslator } from '../GermiculeTranslator';

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

describe('deconstructGermicule', () => {
  it('should handle empty germicule data', () => {
    const translator: GermiculeTranslator = new GermiculeTranslator(COLORS);
    const result = translator.toGraphInfo({ germicules: emptyGermicule });
    expect(result).toMatchObject(emptyGraphInfo);
  });
  it('should handle unknown germicule data', () => {
    const translator: GermiculeTranslator = new GermiculeTranslator(COLORS);
    const result = translator.toGraphInfo({ germicules: unknownGermicule });
    expect(result).toMatchObject(unknownGraphInfo);
  });
  it('should handle lonely germicule data', () => {
    const translator: GermiculeTranslator = new GermiculeTranslator(COLORS);
    const result = translator.toGraphInfo({ germicules: lonelyGermicule });
    expect(result).toMatchObject(lonelyGraphInfo);
  });
  it('should handle twin germicule data', () => {
    const translator: GermiculeTranslator = new GermiculeTranslator(COLORS);
    const result = translator.toGraphInfo({ germicules: twinGermicule });
    expect(result).toMatchObject(twinGraphInfo);
  });
  it('should handle link germicule data', () => {
    const translator: GermiculeTranslator = new GermiculeTranslator(COLORS);
    const result = translator.toGraphInfo({ germicules: linkGermicule });
    expect(result).toMatchObject(linkGraphInfo);
  });
  it('should handle cluster germicule data', () => {
    const translator: GermiculeTranslator = new GermiculeTranslator(COLORS);
    const result = translator.toGraphInfo({ germicules: clusterGermicule });
    expect(result).toMatchObject(clusterGraphInfo);
  });
});
