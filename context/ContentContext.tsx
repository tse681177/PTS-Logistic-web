"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { b2bStore } from "@/lib/store";
import { SiteContent, ContentSection } from "@/lib/types";

interface ContentContextType {
  getContent: (key: string, fallback?: string) => string;
  allContents: SiteContent[];
  saveContent: (key: string, value: string) => Promise<boolean>;
  saveBulkContents: (updates: { key: string; value: string }[]) => Promise<boolean>;
  resetDefaults: () => Promise<void>;
  refreshContents: () => void;
}

const ContentContext = createContext<ContentContextType>({
  getContent: (_key: string, fallback = "") => fallback,
  allContents: [],
  saveContent: async () => false,
  saveBulkContents: async () => false,
  resetDefaults: async () => {},
  refreshContents: () => {},
});

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [contentMap, setContentMap] = useState<Record<string, string>>({});
  const [allContents, setAllContents] = useState<SiteContent[]>([]);

  const loadData = () => {
    b2bStore.initializeIfEmpty();
    const list = b2bStore.getSiteContents();
    setAllContents(list);
    const map: Record<string, string> = {};
    list.forEach((item) => {
      map[item.key] = item.value;
    });
    setContentMap(map);
  };

  useEffect(() => {
    loadData();
    const unsubscribe = b2bStore.subscribe(loadData);
    return () => unsubscribe();
  }, []);

  const getContent = (key: string, fallback: string = ""): string => {
    if (contentMap[key] !== undefined && contentMap[key] !== "") {
      return contentMap[key];
    }
    return fallback;
  };

  const saveContent = async (key: string, value: string): Promise<boolean> => {
    const success = await b2bStore.updateSiteContent(key, value);
    if (success) {
      loadData();
    }
    return success;
  };

  const saveBulkContents = async (updates: { key: string; value: string }[]): Promise<boolean> => {
    const success = await b2bStore.bulkUpdateSiteContents(updates);
    if (success) {
      loadData();
    }
    return success;
  };

  const resetDefaults = async (): Promise<void> => {
    await b2bStore.resetSiteContentsToDefault();
    loadData();
  };

  return (
    <ContentContext.Provider
      value={{
        getContent,
        allContents,
        saveContent,
        saveBulkContents,
        resetDefaults,
        refreshContents: loadData,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(ContentContext);
}
