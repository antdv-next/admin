export const useAuthorization = createGlobalState(() =>
  useStorage<string | null>('authorization', null),
);
