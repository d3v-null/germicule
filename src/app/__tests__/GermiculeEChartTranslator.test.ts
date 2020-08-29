import {
  emptyGermicule,
  unknownGermicule,
  lonelyGermicule,
  twinGermicule,
  linkGermicule,
  clusterGermicule,
  emptyEChartGraphInfo,
  unknownEChartGraphInfo,
  lonelyEChartGraphInfo,
  twinEChartGraphInfo,
  linkEChartGraphInfo,
  clusterEChartGraphInfo,
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
    const result = translator.toGraphInfo({ germicules: emptyGermicule });
    expect(result).toMatchObject(emptyEChartGraphInfo);
  });
  it('should handle unknown germicule data', () => {
    const translator: GermiculeEChartTranslator = new GermiculeEChartTranslator(
      COLORS,
    );
    const result = translator.toGraphInfo({ germicules: unknownGermicule });
    expect(result).toMatchObject(unknownEChartGraphInfo);
  });
  it('should handle lonely germicule data', () => {
    const translator: GermiculeEChartTranslator = new GermiculeEChartTranslator(
      COLORS,
    );
    const result = translator.toGraphInfo({ germicules: lonelyGermicule });
    expect(result).toMatchObject(lonelyEChartGraphInfo);
  });
  it('should handle twin germicule data', () => {
    const translator: GermiculeEChartTranslator = new GermiculeEChartTranslator(
      COLORS,
    );
    const result = translator.toGraphInfo({ germicules: twinGermicule });
    expect(result.nodes).toMatchObject(twinEChartGraphInfo.nodes!);
    expect(Array.from(result.edges.values())).toMatchObject(
      Array.from(twinEChartGraphInfo.edges!.values()),
    );
  });
  it('should handle link germicule data', () => {
    const translator: GermiculeEChartTranslator = new GermiculeEChartTranslator(
      COLORS,
    );
    const result = translator.toGraphInfo({ germicules: linkGermicule });
    expect(result.nodes).toMatchObject(linkEChartGraphInfo.nodes!);
    expect(Array.from(result.edges.values())).toMatchObject(
      Array.from(linkEChartGraphInfo.edges!.values()),
    );
  });
  it('should handle cluster germicule data', () => {
    const translator: GermiculeEChartTranslator = new GermiculeEChartTranslator(
      COLORS,
    );
    const result = translator.toGraphInfo({ germicules: clusterGermicule });
    expect(result.nodes).toMatchObject(clusterEChartGraphInfo.nodes!);
    expect(result.clusters).toMatchObject(clusterEChartGraphInfo.clusters!);
    expect(Array.from(result.edges.values())).toMatchObject(
      Array.from(clusterEChartGraphInfo.edges!.values()),
    );
  });
});
