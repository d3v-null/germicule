import {
  emptyGermicule,
  unknownGermicule,
  lonelyGermicule,
  twinGermicule,
  linkGermicule,
  groupGermicule,
  emptyEChartGraphInfo,
  unknownEChartGraphInfo,
  lonelyEChartGraphInfo,
  twinEChartGraphInfo,
  linkEChartGraphInfo,
  groupEChartGraphInfo,
} from './germicule.data';
import { GermiculeEChartTranslator } from '../GermiculeTranslator';

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

describe('GermiculeEChartTranslator.toGraphInfo', () => {
  it('should handle empty germicule data', () => {
    const translator: GermiculeEChartTranslator = new GermiculeEChartTranslator(
      COLORS,
    );
    const result = translator.toGraphInfo({ connections: emptyGermicule });
    expect(result).toMatchObject(emptyEChartGraphInfo);
  });
  it('should handle unknown germicule data', () => {
    const translator: GermiculeEChartTranslator = new GermiculeEChartTranslator(
      COLORS,
    );
    const result = translator.toGraphInfo({ connections: unknownGermicule });
    expect(result).toMatchObject(unknownEChartGraphInfo);
  });
  it('should handle lonely germicule data', () => {
    const translator: GermiculeEChartTranslator = new GermiculeEChartTranslator(
      COLORS,
    );
    const result = translator.toGraphInfo({ connections: lonelyGermicule });
    expect(result).toMatchObject(lonelyEChartGraphInfo);
  });
  it('should handle twin germicule data', () => {
    const translator: GermiculeEChartTranslator = new GermiculeEChartTranslator(
      COLORS,
    );
    const result = translator.toGraphInfo({ connections: twinGermicule });
    expect(result.nodes).toMatchObject(twinEChartGraphInfo.nodes!);
    expect(Array.from(result.edges.values())).toMatchObject(
      Array.from(twinEChartGraphInfo.edges!.values()),
    );
  });
  it('should handle link germicule data', () => {
    const translator: GermiculeEChartTranslator = new GermiculeEChartTranslator(
      COLORS,
    );
    const result = translator.toGraphInfo({ connections: linkGermicule });
    expect(result.nodes).toMatchObject(linkEChartGraphInfo.nodes!);
    expect(Array.from(result.edges.values())).toMatchObject(
      Array.from(linkEChartGraphInfo.edges!.values()),
    );
  });
  it('should handle group germicule data', () => {
    const translator: GermiculeEChartTranslator = new GermiculeEChartTranslator(
      COLORS,
    );
    const result = translator.toGraphInfo({ connections: groupGermicule });
    expect(result.nodes).toMatchObject(groupEChartGraphInfo.nodes!);
    expect(result.groups).toMatchObject(groupEChartGraphInfo.groups!);
    expect(Array.from(result.edges.values())).toMatchObject(
      Array.from(groupEChartGraphInfo.edges!.values()),
    );
  });
});
