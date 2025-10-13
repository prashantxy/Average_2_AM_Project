declare module "pdf-parse" {
  interface PdfParseOptions {
    max?: number;
    version?: string;
  }

  interface PdfParseResult {
    text: string;
    numpages: number;
    numrender: number;
    info: any;
    metadata: any;
    version: string;
  }

  function pdfParse(
    dataBuffer: Buffer,
    options?: PdfParseOptions
  ): Promise<PdfParseResult>;

  export = pdfParse; // CommonJS export
}