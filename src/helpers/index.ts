import { Metadata } from "next";
import { IMetaOptions } from "./types";

export function generateMetadata({
  title,
  description = '',
  keywords = [],
  author = '',
}: IMetaOptions): Metadata {
  return {
    title,
    description,
    keywords: keywords.length ? keywords.join(', ') : undefined,
    authors: author ? [{ name: author }] : undefined,
  };
}
