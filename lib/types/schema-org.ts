/**
 * TypeScript types for Schema.org structured data
 * Based on schema.org vocabulary for JSON-LD
 */

// Base Thing type
export interface Thing {
  "@type": string;
  "@id"?: string;
  name?: string;
  description?: string;
  url?: string;
  image?: string | ImageObject | ImageObject[];
  sameAs?: string[];
}

// Image Object
export interface ImageObject {
  "@type": "ImageObject";
  url: string;
  width?: number;
  height?: number;
  caption?: string;
}

// Organization
export interface Organization extends Thing {
  "@type": "Organization" | "EducationalOrganization";
  legalName?: string;
  email?: string;
  telephone?: string;
  address?: PostalAddress;
  logo?: ImageObject | string;
  foundingDate?: string;
  founder?: Person | Person[];
  contactPoint?: ContactPoint;
}

// Person
export interface Person extends Thing {
  "@type": "Person";
  givenName?: string;
  familyName?: string;
  jobTitle?: string;
  worksFor?: Organization;
}

// Postal Address
export interface PostalAddress {
  "@type": "PostalAddress";
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry?: string;
}

// Contact Point
export interface ContactPoint {
  "@type": "ContactPoint";
  contactType?: string;
  email?: string;
  telephone?: string;
  url?: string;
}

// Place
export interface Place extends Thing {
  "@type": "Place";
  address?: PostalAddress | string;
  geo?: GeoCoordinates;
  telephone?: string;
}

// Geo Coordinates
export interface GeoCoordinates {
  "@type": "GeoCoordinates";
  latitude: number;
  longitude: number;
}

// Event
export interface Event extends Thing {
  "@type": "Event";
  startDate: string;
  endDate?: string;
  location?: Place | string;
  organizer?: Organization | Person;
  performer?: Person | Organization | Person[] | Organization[];
  eventStatus?: "EventScheduled" | "EventCancelled" | "EventPostponed" | "EventRescheduled";
  eventAttendanceMode?: "OfflineEventAttendanceMode" | "OnlineEventAttendanceMode" | "MixedEventAttendanceMode";
  offers?: Offer | Offer[];
  isAccessibleForFree?: boolean;
}

// Offer
export interface Offer {
  "@type": "Offer";
  price?: string | number;
  priceCurrency?: string;
  availability?: string;
  url?: string;
  validFrom?: string;
}

// Article
export interface Article extends Thing {
  "@type": "Article" | "BlogPosting" | "NewsArticle";
  headline: string;
  articleBody?: string;
  author?: Person | Organization | (Person | Organization)[];
  datePublished: string;
  dateModified?: string;
  publisher?: Organization;
  mainEntityOfPage?: string;
}

// Course
export interface Course extends Thing {
  "@type": "Course" | "LearningResource";
  provider?: Organization;
  courseCode?: string;
  coursePrerequisites?: string | Course;
  educationalLevel?: string;
  teaches?: string[];
  timeRequired?: string;
  inLanguage?: string;
}

// HowTo
export interface HowTo extends Thing {
  "@type": "HowTo";
  step?: HowToStep[];
  totalTime?: string;
  estimatedCost?: string | MonetaryAmount;
  tool?: string | HowToTool[];
  supply?: string | HowToSupply[];
}

// HowTo Step
export interface HowToStep {
  "@type": "HowToStep";
  name?: string;
  text: string;
  url?: string;
  image?: string | ImageObject;
}

// HowTo Tool
export interface HowToTool {
  "@type": "HowToTool";
  name: string;
}

// HowTo Supply
export interface HowToSupply {
  "@type": "HowToSupply";
  name: string;
}

// Monetary Amount
export interface MonetaryAmount {
  "@type": "MonetaryAmount";
  currency: string;
  value: number;
}

// WebSite
export interface WebSite extends Thing {
  "@type": "WebSite";
  potentialAction?: SearchAction;
  publisher?: Organization;
}

// Search Action
export interface SearchAction {
  "@type": "SearchAction";
  target: string;
  "query-input": string;
}

// WebPage
export interface WebPage extends Thing {
  "@type": "WebPage" | "CollectionPage";
  breadcrumb?: BreadcrumbList;
  mainEntity?: Thing;
  isPartOf?: WebSite;
  datePublished?: string;
  dateModified?: string;
}

// BreadcrumbList
export interface BreadcrumbList {
  "@type": "BreadcrumbList";
  itemListElement: ListItem[];
}

// List Item
export interface ListItem {
  "@type": "ListItem";
  position: number;
  name: string;
  item?: string;
}

// ItemList
export interface ItemList {
  "@type": "ItemList";
  itemListElement: (Thing | ListItem)[];
  numberOfItems?: number;
}

// FAQPage
export interface FAQPage extends Thing {
  "@type": "FAQPage";
  mainEntity: Question[];
}

// Question
export interface Question {
  "@type": "Question";
  name: string;
  acceptedAnswer: Answer;
}

// Answer
export interface Answer {
  "@type": "Answer";
  text: string;
}

// Software Application
export interface SoftwareApplication extends Thing {
  "@type": "SoftwareApplication" | "SoftwareSourceCode";
  applicationCategory?: string;
  operatingSystem?: string;
  codeRepository?: string;
  programmingLanguage?: string;
  runtimePlatform?: string;
}

// Context wrapper for JSON-LD
export interface WithContext<T> {
  "@context": "https://schema.org";
  "@graph"?: T[];
}

// Helper type for JSON-LD documents
export type JsonLdDocument<T = Thing> = WithContext<T> & T;

