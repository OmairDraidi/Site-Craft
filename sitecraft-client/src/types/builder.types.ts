/**
 * Page Builder Types
 * Defines the structure for the visual page builder
 */

// Component types that can be added to the canvas
export type ComponentType = 
  | 'heading' 
  | 'text' 
  | 'button' 
  | 'image' 
  | 'video' 
  | 'form' 
  | 'icon';

// Section types (pre-built templates)
export type SectionType = 
  | 'hero' 
  | 'features' 
  | 'pricing' 
  | 'testimonials' 
  | 'footer';

// Style properties for components
export interface ComponentStyles {
  // Typography
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string | number;
  lineHeight?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  color?: string;
  
  // Layout
  width?: string;
  height?: string;
  maxWidth?: string;
  padding?: string;
  margin?: string;
  display?: string;
  
  // Background
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  
  // Border
  border?: string;
  borderRadius?: string;
  borderColor?: string;
  borderWidth?: string;
  
  // Shadow
  boxShadow?: string;
  
  // Other
  opacity?: number;
  cursor?: string;
  transition?: string;
  
  // Custom properties
  [key: string]: string | number | undefined;
}

// Component data structure
export interface ComponentData {
  id: string;
  type: ComponentType;
  content: string;
  styles: ComponentStyles;
  order?: number;
  visible?: boolean;
  // For buttons
  link?: string;
  linkTarget?: '_blank' | '_self';
  // For images/videos
  src?: string;
  alt?: string;
}

// Section data structure
export interface SectionData {
  id: string;
  type: SectionType | 'custom';
  order: number;
  visible: boolean;
  components: ComponentData[];
  styles?: ComponentStyles;
}

// Full page data structure
export interface PageData {
  id?: string;
  siteId?: string;
  name?: string;
  sections: SectionData[];
}

// Page entity from API
export interface Page {
  id: string;
  tenantId: string;
  siteId: string;
  title: string;
  slug: string;
  metaDescription?: string;
  metaKeywords?: string;
  isPublished: boolean;
  publishedAt?: string;
  pageData: string; // JSON string
  templateId?: string;
  createdAt: string;
  updatedAt: string;
}

// Draggable element definition (for left sidebar)
export interface DraggableElement {
  id: string;
  type: ComponentType;
  label: string;
  icon: string; // Icon name or SVG
  category: 'basic' | 'media' | 'forms';
  defaultContent: string;
  defaultStyles: ComponentStyles;
}

// Pre-built section definition
export interface SectionTemplate {
  id: string;
  type: SectionType;
  label: string;
  thumbnail?: string;
  components: Omit<ComponentData, 'id'>[];
}

// Builder state history item
export interface HistoryState {
  pageData: PageData;
  timestamp: number;
}

// Auto-save status
export type SaveStatus = 'saved' | 'saving' | 'error' | 'unsaved';

// Device preview modes
export type DeviceMode = 'desktop' | 'tablet' | 'mobile';
export const DEVICE_WIDTHS: Record<DeviceMode, number> = {
  desktop: 1200,
  tablet: 768,
  mobile: 375,
};
