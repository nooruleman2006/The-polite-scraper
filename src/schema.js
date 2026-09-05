import { z } from "zod";

export const BookSchema = z.object({
  title: z.string().min(1),
  product_url: z.string().url(),
  price_text: z.string().min(1),
  price_gbp: z.number().positive(),
  availability_text: z.string().min(1),
  rating_text: z.string().min(1),
  description: z.string().nullable(),
  source_page: z.string().url(),
  fetched_at: z.string().min(1),
});

export function normalizeRecord(raw) {
  const priceMatch = raw.price_text?.match(/[\d.]+/);
  const price_gbp = priceMatch ? parseFloat(priceMatch[0]) : NaN;

  return {
    ...raw,
    price_gbp,
  };
}
