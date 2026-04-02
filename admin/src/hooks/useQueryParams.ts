import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo } from "react";

export function useQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useMemo(() => {
    const result: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (value) result[key] = value;
    });
    return result;
  }, [searchParams]);

  const setParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const newParams = { ...params };
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          newParams[key] = value;
        } else {
          delete newParams[key];
        }
      }
      setSearchParams(newParams, { replace: true });
    },
    [params, setSearchParams]
  );

  return { params, setParams };
}
