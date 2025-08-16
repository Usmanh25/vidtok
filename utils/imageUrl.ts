// utils/imageUrl.ts
import imageUrlBuilder from '@sanity/image-url';
import { client } from './client';

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  if (!source || typeof source === 'string') {
    return source || '/default-image.jpg';
  }
  return builder.image(source).url();
}
