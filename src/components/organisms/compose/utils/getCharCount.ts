export const getCharCount = (text: string): number => {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    const charCount = [...segmenter.segment(text)].length;
    return charCount;
}