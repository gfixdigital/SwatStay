import { Edit3, Eye, Plus, Save, Search, Send } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { AdminModal } from "../components/AdminModal";
import { AdminToast } from "../components/AdminToast";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { EmptyState } from "../components/EmptyState";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { contentSections as initialSections } from "../data/content";
import type { ContentField, ContentSection } from "../types/admin";
import { usePreviewState } from "../hooks/usePreviewState";

type EditorMode = "edit" | "preview";

export function ContentPage() {
  const [sections, setSections] = usePreviewState("swatstay.admin.content.preview", initialSections);
  const [search, setSearch] = useState("");
  const [area, setArea] = useState("All");
  const [status, setStatus] = useState("All");
  const [selected, setSelected] = useState<ContentSection | null>(null);
  const [draftFields, setDraftFields] = useState<ContentField[]>([]);
  const [mode, setMode] = useState<EditorMode>("edit");
  const [publishPending, setPublishPending] = useState(false);
  const [toast, setToast] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newArea, setNewArea] = useState<ContentSection["area"]>("Global");

  const visible = useMemo(() => sections.filter((section) => {
    const query = search.toLowerCase();
    return (!query || `${section.title} ${section.description} ${section.area}`.toLowerCase().includes(query))
      && (area === "All" || section.area === area)
      && (status === "All" || section.status === status);
  }), [sections, search, area, status]);

  function openSection(section: ContentSection, nextMode: EditorMode) {
    setSelected(section);
    setDraftFields(section.fields.map((field) => ({ ...field })));
    setMode(nextMode);
  }

  function updateField(key: string, value: string) {
    setDraftFields((current) => current.map((field) => field.key === key ? { ...field, value } : field));
  }

  function saveDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    const updated: ContentSection = { ...selected, fields: draftFields, status: "Draft", updatedAt: "Just now", updatedBy: "Current admin", version: selected.version + 1 };
    setSections((current) => current.map((section) => section.id === selected.id ? updated : section));
    setSelected(updated);
    setToast(`${selected.title} saved as draft.`);
  }

  function publish() {
    if (!selected) return;
    const updated: ContentSection = { ...selected, fields: draftFields, status: "Published", updatedAt: "Just now", updatedBy: "Current admin", version: selected.version + 1 };
    setSections((current) => current.map((section) => section.id === selected.id ? updated : section));
    setSelected(updated);
    setPublishPending(false);
    setToast(`${selected.title} published in frontend state.`);
  }

  function createSection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newTitle.trim()) return;
    const id = `content-custom-${Date.now()}`;
    const section: ContentSection = { id, title: newTitle.trim(), area: newArea, description: "Custom site-builder section. Add fields and connect it to a public component when the content API is available.", fields: [{ key: "content", label: "Content", type: "textarea", value: "", required: false }], status: "Draft", updatedAt: "Just now", updatedBy: "Current admin", version: 1 };
    setSections((current) => [section, ...current]);
    setNewTitle("");
    setNewArea("Global");
    setCreateOpen(false);
    setToast("New content section created as a draft.");
    openSection(section, "edit");
  }

  const hasMissingRequired = draftFields.some((field) => field.required && !field.value.trim());

  return <>
    <PageHeader eyebrow="PUBLIC WEBSITE CONTENT" title="Site builder" description="Manage public copy, calls to action, consent text, legal content, and page sections. Browser preview only until the content API is connected." actions={<button type="button" className="button-primary" onClick={() => setCreateOpen(true)}><Plus size={15}/> Add content section</button>}/>

    <section className="mb-4 grid gap-3 rounded-lg border border-border bg-white p-3 md:grid-cols-[1fr_220px_180px]">
      <label className="relative"><span className="sr-only">Search content</span><Search className="absolute left-3 top-2.5 text-stone" size={16}/><input className="field pl-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search page or content section"/></label>
      <select className="field" value={area} onChange={(event) => setArea(event.target.value)} aria-label="Filter content area"><option>All</option><option>Homepage</option><option>Packages</option><option>Destinations</option><option>Forms</option><option>Global</option><option>Help</option><option>Legal</option></select>
      <select className="field" value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter publish status"><option>All</option><option>Published</option><option>Draft</option></select>
    </section>

    <div className="mb-3 flex items-center justify-between text-sm text-stone"><span>{visible.length} content sections</span>{(search || area !== "All" || status !== "All") && <button type="button" className="text-link" onClick={() => { setSearch(""); setArea("All"); setStatus("All"); }}>Clear filters</button>}</div>

    {visible.length ? <div className="overflow-hidden rounded-lg border border-border bg-white"><div className="divide-y divide-border">{visible.map((section) => <article key={section.id} className="grid gap-3 p-4 lg:grid-cols-[180px_1fr_190px_auto] lg:items-center"><div><span className="text-xs font-semibold text-river">{section.area}</span><h2 className="mt-1 font-bold text-charcoal">{section.title}</h2></div><div className="min-w-0"><p className="text-sm leading-5 text-stone">{section.description}</p><p className="mt-1 truncate text-xs text-stone">{section.fields[0]?.label}: {section.fields[0]?.value}</p></div><div className="text-xs text-stone"><StatusBadge status={section.status}/><span className="mt-2 block">v{section.version} · {section.updatedBy}</span><span className="mt-0.5 block">{section.updatedAt}</span></div><div className="flex gap-2 lg:justify-end"><button type="button" className="button-secondary" onClick={() => openSection(section, "edit")}><Edit3 size={15}/> Edit</button><button type="button" className="button-secondary" onClick={() => openSection(section, "preview")}><Eye size={15}/> Preview</button></div></article>)}</div></div> : <EmptyState title="No content sections found" text="Clear the filters or search for another page section."/>}

    <AdminModal open={Boolean(selected)} onClose={() => setSelected(null)} title={mode === "edit" ? `Edit ${selected?.title ?? "content"}` : `${selected?.title ?? "Content"} preview`} description={selected ? `${selected.area} · version ${selected.version} · ${selected.status}` : undefined} width="max-w-3xl">
      {selected && (mode === "edit" ? <form onSubmit={saveDraft} className="space-y-4">
        <div className="rounded-md border border-border bg-snow p-3 text-sm leading-5 text-stone">{selected.description}</div>
        <div className="grid gap-4">{draftFields.map((field) => <label key={field.key} className="label">{field.label}{field.required && <span className="ml-1 text-[#9c3f2e]">Required</span>}{field.type === "textarea" ? <textarea className="field mt-1.5 min-h-28 resize-y py-3" value={field.value} onChange={(event) => updateField(field.key, event.target.value)} required={field.required}/> : <input type={field.type} className="field mt-1.5" value={field.value} onChange={(event) => updateField(field.key, event.target.value)} required={field.required}/>} {field.helpText && <small className="mt-1.5 block text-xs font-normal leading-5 text-stone">{field.helpText}</small>}</label>)}</div>
        {hasMissingRequired && <p role="alert" className="rounded-md border border-[#e5c1ba] bg-[#fff0ed] p-3 text-sm text-[#9c3f2e]">Complete every required field before publishing.</p>}
        <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end"><button type="button" className="button-secondary" onClick={() => setMode("preview")}><Eye size={15}/> Preview changes</button><button type="submit" className="button-secondary"><Save size={15}/> Save draft</button><button type="button" className="button-primary" disabled={hasMissingRequired} onClick={() => setPublishPending(true)}><Send size={15}/> Publish</button></div>
      </form> : <ContentPreview section={selected} fields={draftFields} onEdit={() => setMode("edit")}/>)}
    </AdminModal>

    <ConfirmDialog open={publishPending} title="Publish website content?" message={`Publish the current ${selected?.title ?? "content"} values to frontend state? The future API will create a version and update the public website.`} confirmLabel="Publish content" onConfirm={publish} onClose={() => setPublishPending(false)}/>
    <AdminModal open={createOpen} onClose={() => setCreateOpen(false)} title="Add content section" description="Create a draft section for a new public website element. It remains browser-only until the content API is connected."><form onSubmit={createSection} className="grid gap-4"><label className="label">Section title<input required className="field mt-1.5" value={newTitle} onChange={(event) => setNewTitle(event.target.value)} placeholder="Example: Package listing empty state"/></label><label className="label">Website area<select className="field mt-1.5" value={newArea} onChange={(event) => setNewArea(event.target.value as ContentSection["area"])}><option>Homepage</option><option>Packages</option><option>Destinations</option><option>Forms</option><option>Global</option><option>Help</option><option>Legal</option></select></label><button className="button-primary">Create draft section</button></form></AdminModal>
    <AdminToast message={toast} onClose={() => setToast("")}/>
  </>;
}

function ContentPreview({ section, fields, onEdit }: { section: ContentSection; fields: ContentField[]; onEdit: () => void }) {
  return <div><div className="rounded-lg border border-border bg-snow p-5"><span className="text-xs font-semibold uppercase tracking-[.08em] text-river">{section.area} preview</span><h2 className="mt-2 text-xl font-bold text-charcoal">{section.title}</h2><div className="mt-5 divide-y divide-border border-y border-border">{fields.map((field) => <div key={field.key} className="py-3"><span className="text-xs font-semibold text-stone">{field.label}</span><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-charcoal">{field.value || "No content entered"}</p></div>)}</div></div><div className="mt-4 flex justify-end"><button type="button" className="button-secondary" onClick={onEdit}><Edit3 size={15}/> Return to editor</button></div></div>;
}
