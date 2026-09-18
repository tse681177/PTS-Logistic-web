"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AdminOrder, Product, TickerItem, SystemSettings, EmailNotificationLog, OrderRequest } from "@/lib/types";
import { b2bStore } from "@/lib/store";
import NewOrderModal from "@/components/admin/NewOrderModal";
import EditOrderModal from "@/components/admin/EditOrderModal";
import ApproveRequestModal from "@/components/admin/ApproveRequestModal";
import AdminRequestsTab from "@/components/admin/AdminRequestsTab";
import ProductModal from "@/components/admin/ProductModal";
import NewTickerModal from "@/components/admin/NewTickerModal";
import AdminProductsTab from "@/components/admin/AdminProductsTab";
import AdminTickerTab from "@/components/admin/AdminTickerTab";
import AdminSystemTab from "@/components/admin/AdminSystemTab";
import AdminContentTab from "@/components/admin/AdminContentTab";
import { 
  ShieldCheck, 
  Truck, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  Activity, 
  Package, 
  AlertCircle,
  ArrowLeft,
  Search,
  FileText,
  Inbox
} from "lucide-react";

export default function AdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [orderRequests, setOrderRequests] = useState<OrderRequest[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([]);
  const [settings, setSettings] = useState<SystemSettings>(b2bStore.getSettings());
  const [emailLogs, setEmailLogs] = useState<EmailNotificationLog[]>([]);

  const [activeTab, setActiveTab] = useState<"requests" | "orders" | "products" | "ticker" | "content" | "system">("requests");
  const [orderSearch, setOrderSearch] = useState("");

  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<AdminOrder | null>(null);
  const [approvingRequest, setApprovingRequest] = useState<OrderRequest | null>(null);
  const [productModalData, setProductModalData] = useState<{ open: boolean; product: Product | null }>({
    open: false,
    product: null
  });
  const [isNewTickerOpen, setIsNewTickerOpen] = useState(false);
  const [notification, setNotification] = useState<string>("");

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  };

  const loadAll = async () => {
    const ords = await b2bStore.getAdminOrders();
    const reqs = await b2bStore.getOrderRequests();
    const prods = await b2bStore.getAllProductsAdmin();
    const ticks = await b2bStore.getTickerItems();
    const sets = b2bStore.getSettings();
    const logs = b2bStore.getEmailLogs();
    setOrders(ords);
    setOrderRequests(reqs);
    setProducts(prods);
    setTickerItems(ticks);
    setSettings(sets);
    setEmailLogs(logs);
  };

  useEffect(() => {
    b2bStore.initializeIfEmpty();
    if (sessionStorage.getItem("pts_admin_authenticated") === "true") {
      setIsAuthenticated(true);
    }
    loadAll();
    const unsub = b2bStore.subscribe(loadAll);
    return () => unsub();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (b2bStore.verifyPassword(pinInput)) {
      setIsAuthenticated(true);
      sessionStorage.setItem("pts_admin_authenticated", "true");
      setAuthError("");
    } else {
      setAuthError("Нэвтрэх нууц үг буруу байна.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("pts_admin_authenticated");
  };

  const handleDeleteOrder = async (orderId: string, orderCode: string) => {
    if (window.confirm(`Захиалга ${orderCode}-г устгах уу?`)) {
      await b2bStore.deleteOrder(orderId);
      showNotification(`Захиалга ${orderCode} устгагдлаа.`);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (window.confirm(`"${name}" бүтээгдэхүүнийг устгах уу?`)) {
      await b2bStore.deleteProduct(id);
      showNotification(`"${name}" устгагдлаа.`);
    }
  };

  const handleDeleteTicker = async (id: string, name: string) => {
    if (window.confirm(`"${name}" ханшийг устгах уу?`)) {
      await b2bStore.deleteTickerItem(id);
      showNotification(`"${name}" ханш устгагдлаа.`);
    }
  };

  const pendingRequestsCount = orderRequests.filter((r) => r.status === "pending").length;

  const filteredOrders = orders.filter((o) =>
    o.order_code.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.destination.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.customer_company.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.driver_name.toLowerCase().includes(orderSearch.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-2xl">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4" />
            <span>Нүүр хуудас руу буцах</span>
          </Link>

          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sky-400 flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">PTS Борлуулалт & Админ</h2>
            <p className="text-xs text-slate-400 mt-1">
              Бөөний бүтээгдэхүүн, захиалга, үнийн удирдлагын портал.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Нэвтрэх нууц үг:</label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Нууц үг оруулах..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-center font-mono text-base tracking-widest focus:outline-none focus:border-blue-500"
                autoFocus
              />
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20"
            >
              <Unlock className="w-4 h-4" />
              <span>Нэвтрэх</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-8 py-3.5 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white" title="Нүүр">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base text-white">{settings.brand_name || "PTS AGRO TRADE"}</h1>
                <span className="text-[10px] bg-blue-500/20 text-sky-300 font-bold px-2 py-0.5 rounded">
                  АДМИН УДИРДЛАГА
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsNewOrderOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-sm shadow-blue-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Шинэ Захиалга Бүртгэх</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/30 hover:text-rose-300 text-slate-400 text-xs font-medium border border-slate-700"
            >
              Гарах
            </button>
          </div>
        </div>
      </header>

      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce shadow-blue-500/30">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 w-full flex-1">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-5 border-b border-slate-800">
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 ${
              activeTab === "requests" ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20" : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Захиалгын хүсэлт</span>
            {pendingRequestsCount > 0 ? (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-slate-950">
                {pendingRequestsCount}
              </span>
            ) : (
              <span className="text-[10px] text-slate-500 font-mono">({orderRequests.length})</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 ${
              activeTab === "orders" ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20" : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Захиалга & Нийлүүлэлт ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 ${
              activeTab === "products" ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20" : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Бүтээгдэхүүний мэдээлэл ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("ticker")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 ${
              activeTab === "ticker" ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20" : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Шууд ханш & Үнэ ({tickerItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("content")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 ${
              activeTab === "content" ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20" : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Вебийн бичвэр засах (CMS)</span>
          </button>

          <button
            onClick={() => setActiveTab("system")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 ${
              activeTab === "system" ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20" : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Систем & Тохиргоо</span>
          </button>
        </div>

        {/* Tab 0: Order Requests */}
        {activeTab === "requests" && (
          <div className="mt-5">
            <AdminRequestsTab
              requests={orderRequests}
              onApproveClick={(req) => setApprovingRequest(req)}
              onNotification={showNotification}
            />
          </div>
        )}

        {/* Tab 1: Orders */}
        {activeTab === "orders" && (
          <div className="mt-5 space-y-4">
            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Захиалгын код, очих газар, харилцагч, жолоочоор хайх..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                <span>Жолоочийн утас, дугаар зөвхөн админ талд ил байна</span>
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Код</th>
                      <th className="py-3 px-4">Захиалагч / Утас</th>
                      <th className="py-3 px-4">Бүтээгдэхүүн / Тонн</th>
                      <th className="py-3 px-4">Очих цэг & Тээвэр</th>
                      <th className="py-3 px-4">Жолооч / Дугаар (Нууц)</th>
                      <th className="py-3 px-4">Төлөв</th>
                      <th className="py-3 px-4 text-right">Үйлдэл</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-500">Захиалга олдсонгүй.</td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-sky-400 whitespace-nowrap">
                            {ord.order_code}
                          </td>
                          <td className="py-3 px-4">
                            <strong className="text-white block">{ord.customer_company}</strong>
                            <span className="text-slate-400">{ord.customer_phone}</span>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="text-slate-200 block">{ord.product_name}</span>
                            <span className="text-sky-400 font-mono font-bold">{ord.quantity_tons} тн</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-slate-300 block">{ord.destination}</span>
                            <span className="text-[11px] text-slate-400">
                              {ord.transport_type === "rail" ? "Төмөр зам" : "Авто тээвэр"}
                            </span>
                          </td>
                          <td className="py-3 px-4 bg-slate-950/60 font-mono text-[11px]">
                            <div className="text-slate-200">Жолооч: {ord.driver_name}</div>
                            <div className="text-sky-400">Утас: {ord.driver_phone}</div>
                            <div className="text-slate-400">
                              {ord.transport_type === "truck" ? `Машин: ${ord.vehicle_plate}` : `Вагон: ${ord.container_number}`}
                            </div>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-200">
                              Шат {ord.status}: {ord.status_label}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingOrder(ord)}
                                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                                title="Захиалгын бүртгэл засах"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-sky-400" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteOrder(ord.id, ord.order_code)}
                                className="p-1.5 rounded bg-slate-800 hover:bg-rose-900/30 text-slate-400 hover:text-rose-400"
                                title="Устгах"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Products */}
        {activeTab === "products" && (
          <AdminProductsTab
            products={products}
            onOpenAdd={() => setProductModalData({ open: true, product: null })}
            onOpenEdit={(prod) => setProductModalData({ open: true, product: prod })}
            onDelete={handleDeleteProduct}
          />
        )}

        {/* Tab 3: Ticker */}
        {activeTab === "ticker" && (
          <AdminTickerTab
            tickerItems={tickerItems}
            onOpenAdd={() => setIsNewTickerOpen(true)}
            onDelete={handleDeleteTicker}
          />
        )}

        {/* Tab 4: Content CMS */}
        {activeTab === "content" && (
          <div className="mt-5">
            <AdminContentTab onNotification={showNotification} />
          </div>
        )}

        {/* Tab 5: System */}
        {activeTab === "system" && (
          <AdminSystemTab
            settings={settings}
            emailLogs={emailLogs}
            onNotification={showNotification}
          />
        )}
      </div>

      <NewOrderModal
        isOpen={isNewOrderOpen}
        onClose={() => setIsNewOrderOpen(false)}
        onSuccess={(code) => showNotification(`Шинэ захиалга ${code} бүртгэгдлээ.`)}
      />

      <EditOrderModal
        order={editingOrder}
        isOpen={Boolean(editingOrder)}
        onClose={() => setEditingOrder(null)}
        onSuccess={(msg) => showNotification(msg)}
      />

      <ApproveRequestModal
        request={approvingRequest}
        isOpen={Boolean(approvingRequest)}
        onClose={() => setApprovingRequest(null)}
        onSuccess={(code) => {
          showNotification(`Хүсэлт баталгаажиж, албан ёсны захиалга ${code} үүслээ.`);
          setActiveTab("orders");
        }}
      />

      <ProductModal
        product={productModalData.product}
        isOpen={productModalData.open}
        onClose={() => setProductModalData({ open: false, product: null })}
        onSuccess={(msg) => showNotification(msg)}
      />

      <NewTickerModal
        isOpen={isNewTickerOpen}
        onClose={() => setIsNewTickerOpen(false)}
        onSuccess={(msg) => showNotification(msg)}
      />
    </div>
  );
}
