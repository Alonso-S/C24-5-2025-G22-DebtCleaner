declare const emailBrand: unique symbol;

export type Email = string & { readonly [emailBrand]: typeof emailBrand };
