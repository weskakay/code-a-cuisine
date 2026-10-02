/** Everything the legal notice shows. Filled by the owner of the site. */
export interface ImprintData {
  owner: string;
  legalNotice: string;
}

/** The legal notice of this installation. */
export const IMPRINT: ImprintData = {
  owner: 'weskakay.de',
  legalNotice: 'https://weskakay.de/impressum',
};
