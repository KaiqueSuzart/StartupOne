import sharp from "sharp";

/**
 * Painel de carro é um caso ruim para OCR: dígitos claros sobre fundo escuro,
 * reflexo, ângulo e ponteiros atravessando o quadro. Uma foto crua costuma
 * não ser lida — daí tentarmos algumas variantes da mesma imagem até uma
 * render um número plausível.
 *
 * A ordem importa: as primeiras são as mais baratas e as que mais acertam em
 * painel digital, que é o caso comum na oficina.
 */

/** Largura mínima: dígito pequeno demais não é reconhecido. */
const TARGET_WIDTH = 1600;

export type VariantName =
  | "original"
  | "cinza-contraste"
  | "invertida"
  | "binarizada";

export interface PreparedImage {
  name: VariantName;
  bytes: Buffer;
}

async function base(image: Uint8Array) {
  return sharp(Buffer.from(image))
    .rotate() // respeita a orientação EXIF da foto do celular
    .resize({ width: TARGET_WIDTH, withoutEnlargement: false, fit: "inside" });
}

export async function prepareVariants(
  image: Uint8Array,
): Promise<PreparedImage[]> {
  const variants: PreparedImage[] = [];

  variants.push({
    name: "original",
    bytes: await (await base(image)).png().toBuffer(),
  });

  // Cinza + normalização: resolve foto escura e de baixo contraste.
  variants.push({
    name: "cinza-contraste",
    bytes: await (await base(image)).greyscale().normalize().png().toBuffer(),
  });

  // Invertida: painel é claro-sobre-escuro, e o Tesseract espera o contrário.
  variants.push({
    name: "invertida",
    bytes: await (await base(image))
      .greyscale()
      .normalize()
      .negate()
      .png()
      .toBuffer(),
  });

  // Binarizada sobre a invertida: último recurso para LCD com brilho.
  variants.push({
    name: "binarizada",
    bytes: await (await base(image))
      .greyscale()
      .normalize()
      .negate()
      .threshold(140)
      .png()
      .toBuffer(),
  });

  return variants;
}
