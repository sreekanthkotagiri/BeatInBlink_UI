export function isValidType(rawType: string) {
    if (typeof rawType !== 'string') return false;
  
    const normalizedType = rawType.trim().toLowerCase();
    
    return normalizedType;
  }