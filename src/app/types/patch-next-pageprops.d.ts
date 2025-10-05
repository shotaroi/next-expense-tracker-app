// Make this a module so it doesn’t go ambient beyond the augmentation
export {};

import "next";

// Re-assert the correct Next PageProps shape (sync params for pages)
declare module "next" {
  export type PageProps<
    Params extends Record<string, string | string[]> = Record<string, string>,
    SearchParams extends Record<string, string | string[] | undefined> =
      Record<string, string | string[] | undefined>
  > = {
    params: Params;
    searchParams?: SearchParams;
  };
}
