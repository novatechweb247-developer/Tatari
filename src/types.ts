export interface Product {
  id: string;
  name: string;
  category: 'living-room' | 'bedroom' | 'custom' | 'other';
  categoryLabel: string;
  image: string;
  description: string;
  features?: string[];
  dimensions?: string;
  materials?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Living Room' | 'Bedroom' | 'Furniture' | 'Showroom' | 'Interiors';
  image: string;
  description: string;
}

export interface EnquiryFormData {
  fullName: string;
  phone: string;
  category: string;
  subject: string;
  message: string;
  preferredContact: 'Phone Call' | 'WhatsApp' | 'Either';
}
