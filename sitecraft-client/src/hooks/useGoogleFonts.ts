/**
 * Google Fonts Loader Hook
 * Dynamically loads Google Fonts at runtime
 */

import { useEffect } from 'react';

export const useGoogleFonts = (fonts: string[]) => {
  useEffect(() => {
    // Filter out duplicates and empty strings
    const uniqueFonts = [...new Set(fonts)].filter(Boolean);
    
    if (uniqueFonts.length === 0) return;

    // Create font families string for Google Fonts API
    const fontFamilies = uniqueFonts
      .map(font => font.replace(/ /g, '+'))
      .join('&family=');

    // Check if link already exists
    const linkId = `google-fonts-${uniqueFonts.join('-').replace(/ /g, '-')}`;
    const existingLink = document.getElementById(linkId);
    
    if (existingLink) return;

    // Create and append link element
    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamilies}&display=swap`;
    document.head.appendChild(link);

    // Cleanup function
    return () => {
      const linkToRemove = document.getElementById(linkId);
      if (linkToRemove) {
        document.head.removeChild(linkToRemove);
      }
    };
  }, [fonts]);
};
