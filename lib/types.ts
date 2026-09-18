export type MilestoneStep = 1 | 2 | 3 | 4 | 5;

export interface MilestoneInfo {
  step: MilestoneStep;
  label: string;
  description: string;
}

export const MILESTONES: Record<MilestoneStep, MilestoneInfo> = {
  1: {
    step: 1,
    label: "Баталгаажсан",
    description: "Захиалгын гэрээ хийгдэж, банкны төлбөр баталгаажсан."
  },
  2: {
    step: 2,
    label: "Ачигдаж байгаа",
    description: "ОХУ-ын үйлдвэр, элеваторт тээврийн хэрэгсэлд ачилт хийгдэж байна."
  },
  3: {
    step: 3,
    label: "Замдаа явж байна",
    description: "Хилээр нэвтэрч, хуваарийн дагуу тээвэрлэгдэж байна."
  },
  4: {
    step: 4,
    label: "Тээврийн зангилаанд ирсэн",
    description: "Улаанбаатар эсвэл бүсийн төв зангилаа өртөөнд буусан."
  },
  5: {
    step: 5,
    label: "Хүргэгдсэн",
    description: "Хүлээн авагчийн агуулахад ачааг бүрэн хүлээлгэн өгсөн."
  }
};

// Safe public view of an order (STRICT PRIVACY: zero driver or vehicle plate leaks)
export interface PublicOrder {
  id: string;
  order_code: string;           // e.g. "PTS-2026-8942"
  product_name: string;         // e.g. "1-р зэргийн буудай"
  quantity_tons: number;        // e.g. 240
  destination: string;          // e.g. "Улаанбаатар, Толгойт өртөө"
  transport_type: "truck" | "rail"; // "truck" = Авто тээвэр, "rail" = Төмөр зам
  status: MilestoneStep;
  status_label: string;
  current_location: string;
  departure_date: string;
  estimated_arrival: string;
  updated_at: string;
  created_at: string;
}

// Confidential full record strictly reserved for authenticated Admin portal
export interface AdminOrder extends PublicOrder {
  customer_company: string;
  customer_contact_person: string;
  customer_phone: string;
  contract_no: string;
  payment_status: "paid" | "advance_50" | "pending";
  // STRICT PRIVATE LOGISTICS DATA (NEVER LEAKED TO PUBLIC):
  driver_name: string;
  driver_phone: string;
  vehicle_plate: string;
  container_number: string;
  admin_notes: string;
}

export interface LabParameter {
  name: string;
  standard: string;
  actual: string;
  unit: string;
  passed: boolean;
}

export interface LabCertDetails {
  cert_no: string;
  lab_name: string;
  accreditation_no: string;
  issue_date: string;
  inspector_name: string;
  conclusion: string;
  parameters: LabParameter[];
}

export interface Product {
  id: string;
  title: string;
  category: "ready" | "preorder"; // "ready" = Бэлэн бараа, "preorder" = Урьдчилсан захиалга
  price_per_ton: number;         // in MNT
  currency: string;
  origin: string;
  packaging: string;
  description: string;
  specs: {
    gluten?: string;
    moisture?: string;
    foreign_matter?: string;
    test_weight?: string;
    protein?: string;
    acid_value?: string;
    oil_content?: string;
  };
  image_url: string;
  lab_cert_pdf_url: string;
  lab_cert_details: LabCertDetails;
  in_stock_tons: number;
  min_order_tons: number;
  is_active: boolean;
}

export interface TickerItem {
  id: string;
  type: "commodity" | "currency";
  name: string;
  code: string;
  price: number;
  change_percent?: number;
  is_up?: boolean;
  unit: string;
  is_active: boolean;
  updated_at: string;
}

export interface SystemSettings {
  admin_password: string;
  brand_name: string;
  logo_url: string;
  notification_emails: string[];
}

export interface EmailNotificationLog {
  id: string;
  order_code: string;
  customer_company: string;
  customer_phone: string;
  product_name: string;
  quantity_tons: number;
  destination: string;
  sent_to: string[];
  timestamp: string;
}

export type ContentSection = "HERO" | "ABOUT" | "LOGISTICS" | "CONTACT" | "COMMON";

export interface SiteContent {
  key: string;
  value: string;
  section: ContentSection;
  label?: string;
  field_type?: "text" | "textarea";
  updated_at: string;
}

export interface OrderRequest {
  id: string;
  request_code: string; // e.g. "REQ-2026-1042"
  customer_company: string;
  customer_contact_person: string;
  customer_phone: string;
  product_name: string;
  quantity_tons: number;
  destination: string;
  notes?: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  reviewed_at?: string;
  admin_notes?: string;
}


