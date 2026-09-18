"use client";

import React, { useState } from "react";
import { SystemSettings, EmailNotificationLog } from "@/lib/types";
import { b2bStore } from "@/lib/store";
import { KeyRound, Image as ImageIcon, Mail, CheckCircle2 } from "lucide-react";

interface AdminSystemTabProps {
  settings: SystemSettings;
  emailLogs: EmailNotificationLog[];
  onNotification: (msg: string) => void;
}

export default function AdminSystemTab({ settings, emailLogs, onNotification }: AdminSystemTabProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [logoInput, setLogoInput] = useState(settings.logo_url || "");
  const [brandNameInput, setBrandNameInput] = useState(settings.brand_name || "PTS AGRO TRADE");
  const [newEmailInput, setNewEmailInput] = useState("");

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) return;
    if (newPassword !== confirmPassword) {
      alert("Нууц үг хоорондоо таарахгүй байна.");
      return;
    }
    b2bStore.updatePassword(newPassword);
    setNewPassword("");
    setConfirmPassword("");
    onNotification("Админы нууц үг амжилттай солигдлоо.");
  };

  const handleSaveLogo = (e: React.FormEvent) => {
    e.preventDefault();
    b2bStore.updateLogo(logoInput, brandNameInput);
    onNotification("Лого болон брендийн нэр шинэчлэгдлээ.");
  };

  const handleAddEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmailInput.trim() || !newEmailInput.includes("@")) return;
    const current = settings.notification_emails;
    if (!current.includes(newEmailInput.trim())) {
      const updated = [...current, newEmailInput.trim()];
      b2bStore.updateNotificationEmails(updated);
      setNewEmailInput("");
      onNotification("Мэйл хаяг амжилттай бүртгэгдлээ.");
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    const updated = settings.notification_emails.filter((e) => e !== emailToRemove);
    b2bStore.updateNotificationEmails(updated);
    onNotification("Мэйл хаяг хасагдлаа.");
  };

  return (
    <div className="mt-5 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Change Password */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-sky-400" />
            <span>Админы Нэвтрэх Нууц Үг Солих</span>
          </h4>
          <p className="text-xs text-slate-400 mb-4">
            Шинэ нууц үгээ оруулан хадгалснаар дараагийн нэвтрэлтэд шууд үйлчилнэ.
          </p>

          <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 mb-1">Шинэ нууц үг:</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Шинэ нууц үг..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Шинэ нууц үг давтах:</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Дахин оруулах..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-sm shadow-blue-500/20"
            >
              Нууц үг шинэчлэх
            </button>
          </form>
        </div>

        {/* Change Logo */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-sky-400" />
            <span>Лого & Брендийн Нэр Солих</span>
          </h4>
          <p className="text-xs text-slate-400 mb-4">Вэбсайтын толгой хэсэгт харагдах лого болон нэр.</p>

          <form onSubmit={handleSaveLogo} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 mb-1">Брендийн нэр:</label>
              <input
                type="text"
                value={brandNameInput}
                onChange={(e) => setBrandNameInput(e.target.value)}
                placeholder="PTS AGRO TRADE"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Лого зургийн URL:</label>
              <input
                type="text"
                value={logoInput}
                onChange={(e) => setLogoInput(e.target.value)}
                placeholder="https://example.com/logo.png"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-sm shadow-blue-500/20"
            >
              Лого шинэчлэх
            </button>
          </form>
        </div>
      </div>

      {/* Register Notification Emails */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
        <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
          <Mail className="w-4 h-4 text-sky-400" />
          <span>Бүртгэлтэй Мэйл Хаягууд (Захиалгын мэдэгдэл хүлээн авах)</span>
        </h4>
        <p className="text-xs text-slate-400 mb-4">
          Хэрэглэгч сайтаас "Бөөний захиалга өгөх" маягтыг илгээхэд доорх хаягуудад захиалгын мэдээлэл цаг тухайд нь шууд илгээгдэнэ.
        </p>

        <form onSubmit={handleAddEmail} className="flex gap-2 max-w-md mb-4 text-xs">
          <input
            type="email"
            required
            value={newEmailInput}
            onChange={(e) => setNewEmailInput(e.target.value)}
            placeholder="order@pts-logistics.mn"
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm shadow-blue-500/20"
          >
            Мэйл нэмэх
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          {settings.notification_emails.map((email) => (
            <div
              key={email}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200"
            >
              <span>{email}</span>
              <button
                type="button"
                onClick={() => handleRemoveEmail(email)}
                className="text-slate-500 hover:text-rose-400 font-bold ml-1"
                title="Устгах"
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        {emailLogs.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-800">
            <h5 className="text-xs font-bold text-slate-300 mb-2">
              Сүүлд илгээгдсэн захиалгын мэйл мэдэгдлийн түүх:
            </h5>
            <div className="space-y-1.5 max-h-40 overflow-y-auto font-mono text-[11px]">
              {emailLogs.map((log) => (
                <div key={log.id} className="p-2 rounded bg-slate-950 text-slate-300 flex items-center justify-between">
                  <div>
                    <span className="text-sky-400 font-bold">{log.order_code}</span>: {log.customer_company} ({log.quantity_tons} тн {log.product_name})
                  </div>
                  <div className="text-slate-500 text-[10px]">
                    {log.timestamp} • {log.sent_to.join(", ")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
