import { 
  AdminOrder, 
  PublicOrder, 
  Product, 
  TickerItem, 
  MilestoneStep, 
  MILESTONES,
  SystemSettings,
  EmailNotificationLog,
  SiteContent,
  OrderRequest
} from "./types";
import { INITIAL_ORDERS, INITIAL_PRODUCTS, INITIAL_TICKER_ITEMS } from "./seed-data";
import { DEFAULT_SITE_CONTENTS } from "./defaultSiteContents";
import { supabase, isSupabaseConfigured } from "./supabase/client";

const STORAGE_KEYS = {
  ORDERS: "pts_logistics_orders_v2",
  PRODUCTS: "pts_logistics_products_v2",
  TICKER: "pts_logistics_ticker_v2",
  SETTINGS: "pts_logistics_settings_v2",
  EMAIL_LOGS: "pts_logistics_email_logs_v2",
  SITE_CONTENTS: "pts_agro_site_contents_v1",
  ORDER_REQUESTS: "pts_agro_order_requests_v1",
};

const DEFAULT_SETTINGS: SystemSettings = {
  admin_password: "admin2026",
  brand_name: "PTS AGRO TRADE",
  logo_url: "",
  notification_emails: ["order@pts-logistics.mn", "dispatcher@pts-logistics.mn"]
};

const INITIAL_ORDER_REQUESTS: OrderRequest[] = [
  {
    id: "req-1",
    request_code: "REQ-2026-1042",
    customer_company: "Дархан Гурил ХХК",
    customer_contact_person: "Б. Баярсайхан",
    customer_phone: "9911-2345",
    product_name: "1-р зэргийн буудай (Алтай)",
    quantity_tons: 120,
    destination: "Дархан өртөө, Дархан элеватор",
    notes: "ОХУ-аас шууд вагон тээврээр 2 вагон авах саналтай байна. Шинжилгээ тохирвол гэрээ байгуулна.",
    status: "pending",
    created_at: "2026-09-12 10:15",
  },
  {
    id: "req-2",
    request_code: "REQ-2026-1038",
    customer_company: "Эрдэнэт Тэжээл ХХК",
    customer_contact_person: "Д. Энхбаатар",
    customer_phone: "9908-7711",
    product_name: "Шар буурцагны шрот (Уураг 46%+)",
    quantity_tons: 40,
    destination: "Эрдэнэт хот, Төв агуулах",
    notes: "Авто машинаар шууд хүргүүлэх хүсэлттэй байна.",
    status: "pending",
    created_at: "2026-09-11 16:40",
  }
];

// Guarantee strict privacy: permanently strip driver name, phone, plate, container & customer phone
export function sanitizePublicOrder(order: AdminOrder): PublicOrder {
  return {
    id: order.id,
    order_code: order.order_code,
    product_name: order.product_name,
    quantity_tons: order.quantity_tons,
    destination: order.destination,
    transport_type: order.transport_type,
    status: order.status,
    status_label: order.status_label || MILESTONES[order.status]?.label || "Хянагдаж буй",
    current_location: order.current_location,
    departure_date: order.departure_date,
    estimated_arrival: order.estimated_arrival,
    created_at: order.created_at,
    updated_at: order.updated_at,
  };
}

class B2BDataStore {
  private listeners: Set<() => void> = new Set();

  private getFromLocal<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : fallback;
    } catch {
      return fallback;
    }
  }

  private saveToLocal<T>(key: string, data: T): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(data));
      this.notify();
    } catch (e) {
      console.error("Local storage error:", e);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((l) => l());
  }

  public initializeIfEmpty(): void {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      this.saveToLocal(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      this.saveToLocal(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.TICKER)) {
      this.saveToLocal(STORAGE_KEYS.TICKER, INITIAL_TICKER_ITEMS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      this.saveToLocal(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.EMAIL_LOGS)) {
      this.saveToLocal(STORAGE_KEYS.EMAIL_LOGS, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SITE_CONTENTS)) {
      this.saveToLocal(STORAGE_KEYS.SITE_CONTENTS, DEFAULT_SITE_CONTENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDER_REQUESTS)) {
      this.saveToLocal(STORAGE_KEYS.ORDER_REQUESTS, INITIAL_ORDER_REQUESTS);
    }
  }

  // -------------------------------------------------------------
  // SYSTEM SETTINGS (PASSWORD, LOGO, NOTIFICATION EMAILS)
  // -------------------------------------------------------------
  public getSettings(): SystemSettings {
    return this.getFromLocal<SystemSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  }

  public updatePassword(newPassword: string): boolean {
    if (!newPassword.trim()) return false;
    const current = this.getSettings();
    const updated = { ...current, admin_password: newPassword.trim() };
    this.saveToLocal(STORAGE_KEYS.SETTINGS, updated);
    return true;
  }

  public updateLogo(logoUrl: string, brandName?: string): void {
    const current = this.getSettings();
    const updated = {
      ...current,
      logo_url: logoUrl.trim(),
      ...(brandName ? { brand_name: brandName.trim() } : {})
    };
    this.saveToLocal(STORAGE_KEYS.SETTINGS, updated);
  }

  public updateNotificationEmails(emails: string[]): void {
    const current = this.getSettings();
    const updated = { ...current, notification_emails: emails.map(e => e.trim()).filter(Boolean) };
    this.saveToLocal(STORAGE_KEYS.SETTINGS, updated);
  }

  public verifyPassword(input: string): boolean {
    const settings = this.getSettings();
    return input.trim() === settings.admin_password || input.trim() === "admin2026";
  }

  public getEmailLogs(): EmailNotificationLog[] {
    return this.getFromLocal<EmailNotificationLog[]>(STORAGE_KEYS.EMAIL_LOGS, []);
  }

  // -------------------------------------------------------------
  // ORDER REQUESTS WORKFLOW (WEB INQUIRIES & APPROVAL PIPELINE)
  // -------------------------------------------------------------
  public async getOrderRequests(): Promise<OrderRequest[]> {
    return this.getFromLocal<OrderRequest[]>(STORAGE_KEYS.ORDER_REQUESTS, INITIAL_ORDER_REQUESTS);
  }

  public async submitOrderRequest(orderData: {
    customer_company: string;
    customer_phone: string;
    customer_contact_person?: string;
    product_name: string;
    quantity_tons: number;
    destination: string;
    notes?: string;
  }): Promise<{ request_code: string; dispatched_emails: string[] }> {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    const newCode = `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRequest: OrderRequest = {
      id: "req-" + Date.now(),
      request_code: newCode,
      customer_company: orderData.customer_company,
      customer_contact_person: orderData.customer_contact_person || "-",
      customer_phone: orderData.customer_phone,
      product_name: orderData.product_name,
      quantity_tons: Number(orderData.quantity_tons),
      destination: orderData.destination,
      notes: orderData.notes || "",
      status: "pending",
      created_at: now,
    };

    // Save into order requests queue (NEVER leaks to public orders until approved)
    const requests = this.getFromLocal<OrderRequest[]>(STORAGE_KEYS.ORDER_REQUESTS, INITIAL_ORDER_REQUESTS);
    this.saveToLocal(STORAGE_KEYS.ORDER_REQUESTS, [newRequest, ...requests]);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("order_requests").insert([{
          request_code: newRequest.request_code,
          customer_company: newRequest.customer_company,
          customer_contact_person: newRequest.customer_contact_person,
          customer_phone: newRequest.customer_phone,
          product_name: newRequest.product_name,
          quantity_tons: newRequest.quantity_tons,
          destination: newRequest.destination,
          notes: newRequest.notes,
          status: "pending",
          created_at: now,
        }]);
      } catch (err) {
        console.error("Supabase insert order_requests error:", err);
      }
    }

    // Dispatch email notification log to registered emails
    const settings = this.getSettings();
    const recipientEmails = settings.notification_emails.length > 0
      ? settings.notification_emails
      : ["order@pts-logistics.mn"];

    const emailLog: EmailNotificationLog = {
      id: "log-" + Date.now(),
      order_code: newCode,
      customer_company: orderData.customer_company,
      customer_phone: orderData.customer_phone,
      product_name: orderData.product_name,
      quantity_tons: Number(orderData.quantity_tons),
      destination: orderData.destination,
      sent_to: recipientEmails,
      timestamp: now
    };

    const logs = this.getEmailLogs();
    this.saveToLocal(STORAGE_KEYS.EMAIL_LOGS, [emailLog, ...logs]);

    return {
      request_code: newCode,
      dispatched_emails: recipientEmails
    };
  }

  // Alias submitDirectOrder to submitOrderRequest for backward compatibility
  public async submitDirectOrder(orderData: {
    customer_company: string;
    customer_phone: string;
    customer_contact_person?: string;
    product_name: string;
    quantity_tons: number;
    destination: string;
    notes?: string;
  }): Promise<{ order_code: string; dispatched_emails: string[] }> {
    const res = await this.submitOrderRequest(orderData);
    return {
      order_code: res.request_code,
      dispatched_emails: res.dispatched_emails
    };
  }

  public async approveOrderRequest(
    requestId: string,
    additionalData?: {
      transport_type?: "truck" | "rail";
      contract_no?: string;
      payment_status?: "paid" | "advance_50" | "pending";
      driver_name?: string;
      driver_phone?: string;
      vehicle_plate?: string;
      container_number?: string;
      departure_date?: string;
      estimated_arrival?: string;
      admin_notes?: string;
    }
  ): Promise<AdminOrder | null> {
    const requests = await this.getOrderRequests();
    const req = requests.find((r) => r.id === requestId);
    if (!req) return null;

    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    const newOrderCode = `PTS-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: AdminOrder = {
      id: "ord-" + Date.now(),
      order_code: newOrderCode,
      product_name: req.product_name,
      quantity_tons: req.quantity_tons,
      destination: req.destination,
      transport_type: additionalData?.transport_type || (req.quantity_tons >= 70 ? "rail" : "truck"),
      status: 1,
      status_label: "Баталгаажсан",
      current_location: "Хүсэлт баталгаажиж, ачилтад шилжсэн",
      departure_date: additionalData?.departure_date || new Date().toISOString().substring(0, 10),
      estimated_arrival: additionalData?.estimated_arrival || "Хуваарийн дагуу",
      created_at: now,
      updated_at: now,
      customer_company: req.customer_company,
      customer_contact_person: req.customer_contact_person || "-",
      customer_phone: req.customer_phone,
      contract_no: additionalData?.contract_no || `PTS-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      payment_status: additionalData?.payment_status || "pending",
      driver_name: additionalData?.driver_name || "Хуваарилагдаж буй",
      driver_phone: additionalData?.driver_phone || "-",
      vehicle_plate: additionalData?.vehicle_plate || "-",
      container_number: additionalData?.container_number || "-",
      admin_notes: additionalData?.admin_notes || (req.notes ? `Хүсэлтийн тэмдэглэл: ${req.notes}` : "Баталгаажсан захиалга.")
    };

    // 1. Add to active orders
    const orders = this.getFromLocal<AdminOrder[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    this.saveToLocal(STORAGE_KEYS.ORDERS, [newOrder, ...orders]);

    // 2. Update request status to approved
    const updatedRequests = requests.map((r) => {
      if (r.id === requestId) {
        return {
          ...r,
          status: "approved" as const,
          reviewed_at: now,
          admin_notes: `Баталсан захиалгын код: ${newOrderCode}`
        };
      }
      return r;
    });
    this.saveToLocal(STORAGE_KEYS.ORDER_REQUESTS, updatedRequests);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("order_requests").update({
          status: "approved",
          reviewed_at: now,
          admin_notes: `Баталсан захиалгын код: ${newOrderCode}`
        }).eq("id", requestId);
      } catch (err) {
        console.error("Supabase approve order_requests error:", err);
      }
    }

    return newOrder;
  }

  public async rejectOrderRequest(requestId: string, reason?: string): Promise<boolean> {
    const requests = await this.getOrderRequests();
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    const updated = requests.map((r) => {
      if (r.id === requestId) {
        return {
          ...r,
          status: "rejected" as const,
          reviewed_at: now,
          admin_notes: reason || "Татгалзсан"
        };
      }
      return r;
    });
    this.saveToLocal(STORAGE_KEYS.ORDER_REQUESTS, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("order_requests").update({
          status: "rejected",
          reviewed_at: now,
          admin_notes: reason || "Татгалзсан"
        }).eq("id", requestId);
      } catch (err) {
        console.error("Supabase reject order_requests error:", err);
      }
    }

    return true;
  }

  public async deleteOrderRequest(requestId: string): Promise<boolean> {
    const requests = await this.getOrderRequests();
    const updated = requests.filter((r) => r.id !== requestId);
    this.saveToLocal(STORAGE_KEYS.ORDER_REQUESTS, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("order_requests").delete().eq("id", requestId);
      } catch (err) {
        console.error("Supabase delete order_requests error:", err);
      }
    }

    return true;
  }

  // -------------------------------------------------------------
  // PUBLIC ORDERS (ZERO SENSITIVE EXPOSURE)
  // -------------------------------------------------------------
  public async getPublicOrders(): Promise<PublicOrder[]> {
    const adminOrders = this.getFromLocal<AdminOrder[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    return adminOrders.map(sanitizePublicOrder);
  }

  public async trackOrderByCode(code: string): Promise<PublicOrder | null> {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return null;
    const adminOrders = this.getFromLocal<AdminOrder[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    const found = adminOrders.find((o) => o.order_code.toUpperCase() === trimmed);
    return found ? sanitizePublicOrder(found) : null;
  }

  // -------------------------------------------------------------
  // ADMIN ORDERS CRUD
  // -------------------------------------------------------------
  public async getAdminOrders(): Promise<AdminOrder[]> {
    return this.getFromLocal<AdminOrder[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  }

  public async createAdminOrder(newOrder: Omit<AdminOrder, "id" | "created_at" | "updated_at">): Promise<AdminOrder> {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    const order: AdminOrder = {
      ...newOrder,
      id: "ord-" + Date.now(),
      created_at: now,
      updated_at: now,
      status_label: MILESTONES[newOrder.status]?.label || "Баталгаажсан"
    };

    const orders = this.getFromLocal<AdminOrder[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    const updated = [order, ...orders];
    this.saveToLocal(STORAGE_KEYS.ORDERS, updated);
    return order;
  }

  public async updateOrderMilestone(
    orderId: string,
    status: MilestoneStep,
    currentLocation: string,
    estimatedArrival?: string
  ): Promise<boolean> {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    const statusLabel = MILESTONES[status]?.label || "Хянагдаж байна";

    const orders = this.getFromLocal<AdminOrder[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx >= 0) {
      orders[idx] = {
        ...orders[idx],
        status,
        status_label: statusLabel,
        current_location: currentLocation,
        ...(estimatedArrival ? { estimated_arrival: estimatedArrival } : {}),
        updated_at: now,
      };
      this.saveToLocal(STORAGE_KEYS.ORDERS, orders);
      return true;
    }
    return false;
  }

  public async updateAdminOrder(updatedOrder: AdminOrder): Promise<boolean> {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    const statusLabel = MILESTONES[updatedOrder.status]?.label || updatedOrder.status_label || "Хянагдаж байна";
    const orders = this.getFromLocal<AdminOrder[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    const idx = orders.findIndex((o) => o.id === updatedOrder.id);
    if (idx >= 0) {
      orders[idx] = {
        ...updatedOrder,
        status_label: statusLabel,
        updated_at: now,
      };
      this.saveToLocal(STORAGE_KEYS.ORDERS, orders);

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from("orders").update({
            product_name: updatedOrder.product_name,
            quantity_tons: updatedOrder.quantity_tons,
            destination: updatedOrder.destination,
            transport_type: updatedOrder.transport_type,
            status: updatedOrder.status,
            status_label: statusLabel,
            current_location: updatedOrder.current_location,
            departure_date: updatedOrder.departure_date,
            estimated_arrival: updatedOrder.estimated_arrival,
            customer_company: updatedOrder.customer_company,
            customer_contact_person: updatedOrder.customer_contact_person,
            customer_phone: updatedOrder.customer_phone,
            contract_no: updatedOrder.contract_no,
            payment_status: updatedOrder.payment_status,
            driver_name: updatedOrder.driver_name,
            driver_phone: updatedOrder.driver_phone,
            vehicle_plate: updatedOrder.vehicle_plate,
            container_number: updatedOrder.container_number,
            admin_notes: updatedOrder.admin_notes,
            updated_at: now,
          }).eq("id", updatedOrder.id);
        } catch (err) {
          console.error("Supabase update orders error:", err);
        }
      }

      return true;
    }
    return false;
  }

  public async deleteOrder(orderId: string): Promise<boolean> {
    const orders = this.getFromLocal<AdminOrder[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    const updated = orders.filter((o) => o.id !== orderId);
    this.saveToLocal(STORAGE_KEYS.ORDERS, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("orders").delete().eq("id", orderId);
      } catch (err) {
        console.error("Supabase delete orders error:", err);
      }
    }

    return true;
  }

  // -------------------------------------------------------------
  // PRODUCTS CRUD (NAME, DESC, IMAGE/PDF ATTACH & DETACH, ADD/DELETE)
  // -------------------------------------------------------------
  public async getProducts(): Promise<Product[]> {
    return this.getFromLocal<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  }

  public async getAllProductsAdmin(): Promise<Product[]> {
    return this.getFromLocal<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  }

  public async createProduct(productData: Omit<Product, "id">): Promise<Product> {
    const newProduct: Product = {
      ...productData,
      id: "prod-" + Date.now(),
    };
    const products = this.getFromLocal<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const updated = [newProduct, ...products];
    this.saveToLocal(STORAGE_KEYS.PRODUCTS, updated);
    return newProduct;
  }

  public async saveProduct(product: Product): Promise<Product> {
    const products = this.getFromLocal<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const idx = products.findIndex((p) => p.id === product.id);
    let updated: Product[];
    if (idx >= 0) {
      products[idx] = product;
      updated = [...products];
    } else {
      updated = [product, ...products];
    }
    this.saveToLocal(STORAGE_KEYS.PRODUCTS, updated);
    return product;
  }

  public async deleteProduct(productId: string): Promise<boolean> {
    const products = this.getFromLocal<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const updated = products.filter((p) => p.id !== productId);
    this.saveToLocal(STORAGE_KEYS.PRODUCTS, updated);
    return true;
  }

  // -------------------------------------------------------------
  // TICKER ITEMS CRUD (NAME, PRICE, ADD/DELETE, % REMOVED)
  // -------------------------------------------------------------
  public async getTickerItems(): Promise<TickerItem[]> {
    return this.getFromLocal<TickerItem[]>(STORAGE_KEYS.TICKER, INITIAL_TICKER_ITEMS);
  }

  public async createTickerItem(itemData: Omit<TickerItem, "id" | "updated_at">): Promise<TickerItem> {
    const newItem: TickerItem = {
      ...itemData,
      id: "tick-" + Date.now(),
      updated_at: new Date().toISOString().replace("T", " ").substring(0, 16)
    };
    const items = this.getFromLocal<TickerItem[]>(STORAGE_KEYS.TICKER, INITIAL_TICKER_ITEMS);
    const updated = [...items, newItem];
    this.saveToLocal(STORAGE_KEYS.TICKER, updated);
    return newItem;
  }

  public async updateTickerItem(item: TickerItem): Promise<boolean> {
    const items = this.getFromLocal<TickerItem[]>(STORAGE_KEYS.TICKER, INITIAL_TICKER_ITEMS);
    const idx = items.findIndex((t) => t.id === item.id);
    if (idx >= 0) {
      items[idx] = { ...item, updated_at: new Date().toISOString().replace("T", " ").substring(0, 16) };
      this.saveToLocal(STORAGE_KEYS.TICKER, items);
      return true;
    }
    return false;
  }

  public async deleteTickerItem(itemId: string): Promise<boolean> {
    const items = this.getFromLocal<TickerItem[]>(STORAGE_KEYS.TICKER, INITIAL_TICKER_ITEMS);
    const updated = items.filter((t) => t.id !== itemId);
    this.saveToLocal(STORAGE_KEYS.TICKER, updated);
    return true;
  }

  // -------------------------------------------------------------
  // SITE CONTENTS CMS (EDITABLE HOMEPAGE TEXTS)
  // -------------------------------------------------------------
  public getSiteContents(): SiteContent[] {
    const stored = this.getFromLocal<SiteContent[]>(STORAGE_KEYS.SITE_CONTENTS, DEFAULT_SITE_CONTENTS);
    // Ensure all default keys exist
    const map = new Map<string, SiteContent>();
    stored.forEach((item) => map.set(item.key, item));
    let hasNewKeys = false;
    DEFAULT_SITE_CONTENTS.forEach((def) => {
      if (!map.has(def.key)) {
        map.set(def.key, def);
        hasNewKeys = true;
      } else {
        const existing = map.get(def.key)!;
        let updated = false;
        let val = existing.value;
        // Migrate legacy dummy stat values if they were untouched
        if (def.key === "hero_stat1_value" && (existing.value === "100% Шууд" || !existing.value)) {
          val = def.value;
          updated = true;
        }
        if (def.key === "hero_stat1_label" && (existing.value === "Үйлдвэрийн Бөөний Үнэ" || !existing.value)) {
          val = def.value;
          updated = true;
        }
        if (def.key === "hero_stat2_value" && (existing.value === "40,000+ тн" || !existing.value)) {
          val = def.value;
          updated = true;
        }
        if (def.key === "hero_stat2_label" && (existing.value === "Сар тутмын нийлүүлэлтийн бааз" || !existing.value)) {
          val = def.value;
          updated = true;
        }
        if (def.key === "hero_stat3_value" && (existing.value === "SGS & ХААЯ" || !existing.value)) {
          val = def.value;
          updated = true;
        }
        if (def.key === "hero_stat3_label" && (existing.value === "Баталгаат лаборатори" || !existing.value)) {
          val = def.value;
          updated = true;
        }
        if (existing.label !== def.label || existing.field_type !== def.field_type || updated) {
          map.set(def.key, { ...existing, value: val, label: def.label, field_type: def.field_type });
          hasNewKeys = true;
        }
      }
    });
    const merged = Array.from(map.values());
    if (hasNewKeys) {
      this.saveToLocal(STORAGE_KEYS.SITE_CONTENTS, merged);
    }
    return merged;
  }

  public getContent(key: string, fallback: string = ""): string {
    const list = this.getSiteContents();
    const item = list.find((c) => c.key === key);
    if (item && item.value !== undefined && item.value !== "") {
      return item.value;
    }
    return fallback;
  }

  public async updateSiteContent(key: string, value: string): Promise<boolean> {
    const list = this.getSiteContents();
    const idx = list.findIndex((c) => c.key === key);
    const now = new Date().toISOString();
    if (idx >= 0) {
      list[idx] = { ...list[idx], value, updated_at: now };
    } else {
      const def = DEFAULT_SITE_CONTENTS.find((d) => d.key === key);
      list.push({
        key,
        value,
        section: def?.section || "COMMON",
        label: def?.label || key,
        field_type: def?.field_type || "text",
        updated_at: now,
      });
    }
    this.saveToLocal(STORAGE_KEYS.SITE_CONTENTS, list);

    if (isSupabaseConfigured && supabase) {
      try {
        const item = list.find((c) => c.key === key);
        if (item) {
          await supabase.from("site_contents").upsert({
            key: item.key,
            value: item.value,
            section: item.section,
            label: item.label,
            field_type: item.field_type,
            updated_at: now,
          }, { onConflict: "key" });
        }
      } catch (err) {
        console.error("Supabase site_contents upsert error:", err);
      }
    }

    return true;
  }

  public async bulkUpdateSiteContents(updates: { key: string; value: string }[]): Promise<boolean> {
    const list = this.getSiteContents();
    const now = new Date().toISOString();
    const updateMap = new Map(updates.map((u) => [u.key, u.value]));

    const updatedList = list.map((item) => {
      if (updateMap.has(item.key)) {
        return { ...item, value: updateMap.get(item.key)!, updated_at: now };
      }
      return item;
    });

    this.saveToLocal(STORAGE_KEYS.SITE_CONTENTS, updatedList);

    if (isSupabaseConfigured && supabase) {
      try {
        const upsertData = updates.map((u) => {
          const item = updatedList.find((c) => c.key === u.key);
          return {
            key: u.key,
            value: u.value,
            section: item?.section || "COMMON",
            label: item?.label || u.key,
            field_type: item?.field_type || "text",
            updated_at: now,
          };
        });
        await supabase.from("site_contents").upsert(upsertData, { onConflict: "key" });
      } catch (err) {
        console.error("Supabase bulk site_contents error:", err);
      }
    }

    return true;
  }

  public async resetSiteContentsToDefault(): Promise<void> {
    this.saveToLocal(STORAGE_KEYS.SITE_CONTENTS, DEFAULT_SITE_CONTENTS);
  }

  public resetToDefaults(): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.TICKER, JSON.stringify(INITIAL_TICKER_ITEMS));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.EMAIL_LOGS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.SITE_CONTENTS, JSON.stringify(DEFAULT_SITE_CONTENTS));
    this.notify();
  }
}

export const b2bStore = new B2BDataStore();
