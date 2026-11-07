"use client"

import type { ReactNode } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Props = {
  candidates: ReactNode
  content: ReactNode
  settings: ReactNode
}

/** Trois espaces : suivi des candidatures, contenu public, réglages. */
export function AdminTabs({ candidates, content, settings }: Props) {
  return (
    <Tabs defaultValue="candidates" className="gap-6">
      <TabsList variant="line" className="h-auto w-full justify-start gap-2 overflow-x-auto border-b border-slate-200 pb-0">
        {[
          { value: "candidates", label: "Candidatures" },
          { value: "content", label: "Contenu du site" },
          { value: "settings", label: "Réglages" },
        ].map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="rounded-none border-b-2 border-transparent px-4 py-2.5 text-sm font-semibold text-slate-500 data-active:border-congo data-active:text-congo data-[state=active]:border-congo data-[state=active]:text-congo"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="candidates" className="space-y-6">
        {candidates}
      </TabsContent>
      <TabsContent value="content" className="space-y-6">
        {content}
      </TabsContent>
      <TabsContent value="settings" className="space-y-6">
        {settings}
      </TabsContent>
    </Tabs>
  )
}
