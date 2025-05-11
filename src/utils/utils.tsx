export function isValidType(rawType: string) {
    if (typeof rawType !== 'string') return false;
  
    const normalizedType = rawType.trim().toLowerCase();
    
    return normalizedType;
  }

  // utils/utils.ts
export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};
