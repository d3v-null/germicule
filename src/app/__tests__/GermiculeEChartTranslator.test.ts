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
import {
  GermiculeEChartTranslator,
  DEFAULT_THEME,
} from '../GermiculeTranslator';

describe('GermiculeEChartTranslator.toGraphInfo', () => {
  it('should handle empty germicule data', () => {
    const translator: GermiculeEChartTranslator = new GermiculeEChartTranslator(
      DEFAULT_THEME,
    );
    const result = translator.toGraphInfo({ connections: emptyGermicule });
    expect(Array.from(result.nodes.values())).toMatchObject(
      Array.from(emptyEChartGraphInfo.nodes!.values()),
    );
  });
  it('should handle unknown germicule data', () => {
    const translator: GermiculeEChartTranslator = new GermiculeEChartTranslator(
      DEFAULT_THEME,
    );
    const result = translator.toGraphInfo({ connections: unknownGermicule });
    expect(Array.from(result.nodes.values())).toMatchObject(
      Array.from(unknownEChartGraphInfo.nodes!.values()),
    );
  });
  it('should handle lonely germicule data', () => {
    const translator: GermiculeEChartTranslator = new GermiculeEChartTranslator(
      DEFAULT_THEME,
    );
    const result = translator.toGraphInfo({ connections: lonelyGermicule });
    expect(Array.from(result.nodes.values())).toMatchObject(
      Array.from(lonelyEChartGraphInfo.nodes!.values()),
    );
  });
  it('should handle twin germicule data', () => {
    const translator: GermiculeEChartTranslator = new GermiculeEChartTranslator(
      DEFAULT_THEME,
    );
    const result = translator.toGraphInfo({ connections: twinGermicule });
    expect(Array.from(result.nodes.values())).toMatchObject(
      Array.from(twinEChartGraphInfo.nodes!.values()),
    );
    expect(Array.from(result.edges.values())).toMatchObject(
      Array.from(twinEChartGraphInfo.edges!.values()),
    );
  });
  it('should handle link germicule data', () => {
    const translator: GermiculeEChartTranslator = new GermiculeEChartTranslator(
      DEFAULT_THEME,
    );
    const result = translator.toGraphInfo({ connections: linkGermicule });
    expect(Array.from(result.nodes.values())).toMatchObject(
      Array.from(linkEChartGraphInfo.nodes!.values()),
    );
    expect(Array.from(result.edges.values())).toMatchObject(
      Array.from(linkEChartGraphInfo.edges!.values()),
    );
  });
  it('should handle group germicule data', () => {
    const translator: GermiculeEChartTranslator = new GermiculeEChartTranslator(
      DEFAULT_THEME,
    );
    const result = translator.toGraphInfo({ connections: groupGermicule });
    expect(Array.from(result.nodes.values())).toMatchObject(
      Array.from(groupEChartGraphInfo.nodes!.values()),
    );
    expect(result.groups).toMatchObject(groupEChartGraphInfo.groups!);
    expect(Array.from(result.edges.values())).toMatchObject(
      Array.from(groupEChartGraphInfo.edges!.values()),
    );
  });
});
