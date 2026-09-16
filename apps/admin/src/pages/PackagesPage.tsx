import { Copy, Edit3, Eye, Plus } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { AdminModal } from "../components/AdminModal";
import { AdminTabs } from "../components/AdminTabs";
import { AdminToast } from "../components/AdminToast";
import { FileUploadPlaceholder } from "../components/FileUploadPlaceholder";
import { FormField } from "../components/FormField";
import { PageHeader } from "../components/PageHeader";
import { SearchInput } from "../components/SearchInput";
import { StatusBadge } from "../components/StatusBadge";
import { adminPackages as initialPackages } from "../data/packages";
import { formatPkr } from "../data/adminData";
import type { AdminPackage } from "../types/admin";

const steps = ["Basic info", "Pricing", "Services", "Itinerary", "Images", "SEO", "Preview"] as const;
const serviceOptions = ["Hotel", "Transport", "Private transport", "Breakfast", "Meals", "Guide", "Hiking guide", "Photography", "Activity"];
type Step = typeof steps[number];

export function PackagesPage() {
  const [packages, setPackages] = useState(initialPackages);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [destination, setDestination] = useState("All");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<AdminPackage | null>(null);
  const [preview, setPreview] = useState<AdminPackage | null>(null);
  const [toast, setToast] = useState("");

  const visible = useMemo(() => packages.filter((item) => (!search || `${item.title} ${item.slug}`.toLowerCase().includes(search.toLowerCase())) && (status === "All" || item.status === status) && (destination === "All" || item.destination === destination)), [packages, search, status, destination]);

  function openEditor(item?: AdminPackage) { setEditing(item ?? null); setEditorOpen(true); }
  function duplicate(item: AdminPackage) {
    const suffix = packages.filter((entry) => entry.slug.startsWith(`${item.slug}-copy`)).length + 1;
    setPackages((current) => [...current, { ...clonePackage(item), id: `pkg-${Date.now()}`, title: `${item.title} Copy`, slug: `${item.slug}-copy-${suffix}`, status: "Inactive" }]);
    setToast(`${item.title} duplicated as an inactive package.`);
  }
  function savePackage(item: AdminPackage) {
    setPackages((current) => editing ? current.map((entry) => entry.id === item.id ? item : entry) : [...current, item]);
    setEditorOpen(false);
    setToast(`${item.title} ${editing ? "updated" : "created"} in frontend state.`);
  }
  function toggleStatus(item: AdminPackage) {
    const next = item.status === "Active" ? "Inactive" : "Active";
    setPackages((current) => current.map((entry) => entry.id === item.id ? { ...entry, status: next } : entry));
    setToast(`${item.title} is now ${next.toLowerCase()}.`);
  }

  return <>
    <PageHeader eyebrow="TOURIST CATALOG" title="Packages" description="Create fixed packages and custom-trip templates that will later publish to the tourist website." actions={<div className="flex gap-2"><button type="button" className="button-secondary" onClick={() => openEditor()}><Plus size={15}/> Custom template</button><button type="button" className="button-primary" onClick={() => openEditor()}><Plus size={15}/> Create package</button></div>}/>
    <div className="mb-4 grid gap-3 rounded-lg border border-border bg-white p-3 md:grid-cols-3"><SearchInput value={search} onChange={setSearch} placeholder="Search title or slug"/><select className="field" value={destination} onChange={(event) => setDestination(event.target.value)}><option>All</option>{[...new Set(packages.map((item) => item.destination))].map((item) => <option key={item}>{item}</option>)}</select><select className="field" value={status} onChange={(event) => setStatus(event.target.value)}><option>All</option><option>Active</option><option>Inactive</option></select></div>
    <div className="mb-3 flex items-center justify-between text-sm text-stone"><span>{visible.length} packages</span>{(search || destination !== "All" || status !== "All") && <button type="button" className="text-link" onClick={() => { setSearch(""); setDestination("All"); setStatus("All"); }}>Clear filters</button>}</div>
    <div className="grid gap-4 xl:grid-cols-2">{visible.map((item) => <article key={item.id} className="rounded-lg border border-border bg-white p-4"><div className="flex items-start justify-between gap-3"><div><span className="text-xs font-semibold text-river">{item.packageType} · {item.tier}</span><h2 className="mt-1 text-base font-bold text-charcoal">{item.title}</h2><p className="mt-1 text-xs text-stone">/{item.slug}</p></div><StatusBadge status={item.status}/></div><p className="mt-3 line-clamp-2 text-sm leading-5 text-stone">{item.description}</p><dl className="mt-4 grid grid-cols-2 gap-2 rounded-md bg-snow p-3 text-xs sm:grid-cols-4"><Info label="Destination" value={item.destination}/><Info label="Duration" value={`${item.days}D / ${item.nights}N`}/><Info label="Price" value={formatPkr(item.price)}/><Info label="Services" value={String(item.services.length)}/></dl><div className="mt-4 flex flex-wrap gap-2"><button type="button" className="button-secondary" onClick={() => openEditor(item)}><Edit3 size={15}/> Edit</button><button type="button" className="button-secondary" onClick={() => duplicate(item)}><Copy size={15}/> Duplicate</button><button type="button" className="button-secondary" onClick={() => toggleStatus(item)}>{item.status === "Active" ? "Deactivate" : "Activate"}</button><button type="button" className="icon-button ml-auto" title="Preview package" onClick={() => setPreview(item)}><Eye size={15}/></button></div></article>)}</div>
    <PackageEditor open={editorOpen} item={editing} existingPackages={packages} onClose={() => setEditorOpen(false)} onSave={savePackage}/>
    <AdminModal open={Boolean(preview)} onClose={() => setPreview(null)} title={preview?.title ?? "Package preview"} description="Complete package record preview" width="max-w-3xl">{preview && <PackagePreview item={preview}/>}</AdminModal>
    <AdminToast message={toast} onClose={() => setToast("")}/>
  </>;
}

function PackageEditor({ open, item, existingPackages, onClose, onSave }: { open: boolean; item: AdminPackage | null; existingPackages: AdminPackage[]; onClose: () => void; onSave: (item: AdminPackage) => void }) {
  const [step, setStep] = useState<Step>("Basic info");
  const [form, setForm] = useState<AdminPackage>(() => item ? clonePackage(item) : blankPackage());
  const [error, setError] = useState("");
  const activeIndex = steps.indexOf(step);

  useEffect(() => {
    if (!open) return;
    setForm(item ? clonePackage(item) : blankPackage());
    setStep("Basic info");
    setError("");
  }, [item, open]);

  function changeDays(days: number) {
    const safeDays = Math.max(1, days || 1);
    setForm((current) => ({ ...current, days: safeDays, nights: Math.min(current.nights, Math.max(0, safeDays - 1)), itinerary: Array.from({ length: safeDays }, (_, index) => current.itinerary[index] ?? "") }));
  }

  function validateCurrentStep() {
    if (step === "Basic info") {
      if (!form.title.trim() || !form.slug.trim() || !form.description.trim() || !form.destination.trim()) return "Complete the title, slug, description, and destination.";
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) return "Use lowercase letters, numbers, and hyphens for the slug.";
      if (existingPackages.some((entry) => entry.slug === form.slug && entry.id !== form.id)) return "This package slug is already in use.";
    }
    if (step === "Pricing" && (form.days < 1 || form.nights < 0 || form.price < 1 || !form.cancellationSummary.trim())) return "Add a valid duration, starting price, and cancellation summary.";
    if (step === "Services" && !form.services.length) return "Select at least one included service.";
    if (step === "Itinerary" && (form.itinerary.length !== form.days || form.itinerary.some((day) => !day.trim()))) return `Complete all ${form.days} itinerary days.`;
    if (step === "Images" && !form.coverImage.trim()) return "Choose a cover image before continuing.";
    if (step === "SEO" && (!form.seoTitle.trim() || !form.seoDescription.trim())) return "Complete the SEO title and description.";
    return "";
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateCurrentStep();
    if (validation) { setError(validation); return; }
    setError("");
    if (activeIndex < steps.length - 1) setStep(steps[activeIndex + 1]); else onSave(form);
  }

  function selectStep(next: Step) {
    if (steps.indexOf(next) <= activeIndex) { setStep(next); setError(""); return; }
    const validation = validateCurrentStep();
    if (validation) { setError(validation); return; }
    setStep(next);
    setError("");
  }

  return <AdminModal open={open} onClose={onClose} title={item ? "Edit package" : "Create package"} description="Complete frontend form structured for the future package API" width="max-w-4xl"><AdminTabs value={step} onChange={selectStep} tabs={steps.map((value) => ({ value, label: value }))}/><form onSubmit={submit} className="mt-5"><div className="min-h-72">
    {step === "Basic info" && <div className="grid gap-4 md:grid-cols-2"><FormField label="Package title" required><input className="field mt-1.5" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value, ...(!item ? { slug: slugify(event.target.value) } : {}) })} required/></FormField><FormField label="Slug" required><input className="field mt-1.5" value={form.slug} onChange={(event) => setForm({ ...form, slug: slugify(event.target.value) })} required/></FormField><FormField label="Description" required><textarea className="field mt-1.5 min-h-24 py-3" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required/></FormField><FormField label="Destination" required><select className="field mt-1.5" value={form.destination} onChange={(event) => setForm({ ...form, destination: event.target.value })}><option>Kalam</option><option>Swat</option><option>Malam Jabba</option><option>Bahrain</option></select></FormField><FormField label="Package type"><select className="field mt-1.5" value={form.packageType} onChange={(event) => setForm({ ...form, packageType: event.target.value })}>{["Solo", "Couple", "Family", "Group", "Sharing", "Private"].map((value) => <option key={value}>{value}</option>)}</select></FormField><FormField label="Tier"><select className="field mt-1.5" value={form.tier} onChange={(event) => setForm({ ...form, tier: event.target.value })}>{["Basic", "Standard", "Premium", "Luxury"].map((value) => <option key={value}>{value}</option>)}</select></FormField><FormField label="Status"><select className="field mt-1.5" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as AdminPackage["status"] })}><option>Active</option><option>Inactive</option></select></FormField></div>}
    {step === "Pricing" && <div className="grid gap-4 md:grid-cols-2"><FormField label="Duration days" required><input type="number" min="1" max="30" className="field mt-1.5" value={form.days} onChange={(event) => changeDays(Number(event.target.value))}/></FormField><FormField label="Duration nights" required><input type="number" min="0" max={Math.max(0, form.days)} className="field mt-1.5" value={form.nights} onChange={(event) => setForm({ ...form, nights: Number(event.target.value) })}/></FormField><FormField label="Starting price" required><input type="number" min="1" className="field mt-1.5" value={form.price} onChange={(event) => setForm({ ...form, price: Number(event.target.value) })}/></FormField><FormField label="Currency"><select className="field mt-1.5" value={form.currency} onChange={(event) => setForm({ ...form, currency: event.target.value })}><option>PKR</option><option>USD</option><option>CNY</option></select></FormField><FormField label="Cancellation summary" required><textarea className="field mt-1.5 min-h-28 py-3" value={form.cancellationSummary} onChange={(event) => setForm({ ...form, cancellationSummary: event.target.value })} required/></FormField><FormField label="Add-ons"><textarea className="field mt-1.5 min-h-28 py-3" value={form.addOns.join("\n")} onChange={(event) => setForm({ ...form, addOns: lines(event.target.value) })} placeholder="One add-on per line"/></FormField></div>}
    {step === "Services" && <div><p className="mb-3 text-sm text-stone">Select every service included in the advertised starting price.</p><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{serviceOptions.map((service) => { const checked = form.services.includes(service); return <label key={service} className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm font-semibold ${checked ? "border-river bg-mist text-pine" : "border-border bg-white text-charcoal"}`}><input type="checkbox" checked={checked} onChange={() => setForm({ ...form, services: checked ? form.services.filter((value) => value !== service) : [...form.services, service] })} className="h-4 w-4 accent-[#12372A]"/>{service}</label>; })}</div></div>}
    {step === "Itinerary" && <div className="space-y-3">{form.itinerary.map((day, index) => <FormField key={index} label={`Day ${index + 1}`} required><textarea className="field mt-1.5 min-h-20 py-3" value={day} onChange={(event) => setForm({ ...form, itinerary: form.itinerary.map((value, dayIndex) => dayIndex === index ? event.target.value : value) })} placeholder="Route, activities, meals, and overnight location" required/></FormField>)}</div>}
    {step === "Images" && <div className="grid gap-4 md:grid-cols-2"><div><FileUploadPlaceholder label="Choose cover image" accept="JPG, PNG, or WebP" acceptTypes="image/jpeg,image/png,image/webp" onFilesSelected={(files) => files[0] && setForm({ ...form, coverImage: files[0].name })}/><p className="mt-2 text-xs text-stone">Current: {form.coverImage || "No cover selected"}</p></div><div><FileUploadPlaceholder label="Choose gallery images" accept="Multiple JPG, PNG, or WebP files" acceptTypes="image/jpeg,image/png,image/webp" multiple onFilesSelected={(files) => setForm({ ...form, galleryImages: files.map((file) => file.name) })}/><p className="mt-2 text-xs text-stone">Current: {form.galleryImages.join(", ") || "No gallery images"}</p></div></div>}
    {step === "SEO" && <div className="space-y-4"><FormField label="SEO title" required><input className="field mt-1.5" maxLength={70} value={form.seoTitle} onChange={(event) => setForm({ ...form, seoTitle: event.target.value })} required/><small className="mt-1 block text-xs font-normal text-stone">{form.seoTitle.length}/70 characters</small></FormField><FormField label="SEO description" required><textarea className="field mt-1.5 min-h-28 py-3" maxLength={170} value={form.seoDescription} onChange={(event) => setForm({ ...form, seoDescription: event.target.value })} required/><small className="mt-1 block text-xs font-normal text-stone">{form.seoDescription.length}/170 characters</small></FormField></div>}
    {step === "Preview" && <PackagePreview item={form}/>}
  </div>{error && <p role="alert" className="mt-4 rounded-md border border-[#e5c1ba] bg-[#fff0ed] p-3 text-sm text-[#9c3f2e]">{error}</p>}<div className="mt-5 flex items-center justify-between border-t border-border pt-4"><button type="button" className="button-secondary" disabled={activeIndex === 0} onClick={() => { setStep(steps[activeIndex - 1]); setError(""); }}>Previous</button><span className="text-xs text-stone">Step {activeIndex + 1} of {steps.length}</span><button type="submit" className="button-primary">{activeIndex === steps.length - 1 ? "Save package" : "Continue"}</button></div></form></AdminModal>;
}

function PackagePreview({ item }: { item: AdminPackage }) { return <div className="overflow-hidden rounded-lg border border-border bg-snow"><div className="border-b border-border bg-white p-5"><div className="flex items-start justify-between gap-3"><div><span className="text-xs font-semibold text-river">{item.packageType} · {item.tier}</span><h3 className="mt-2 text-xl font-bold text-charcoal">{item.title || "Untitled package"}</h3><p className="mt-2 text-sm leading-6 text-stone">{item.description || "No description"}</p></div><StatusBadge status={item.status}/></div></div><div className="grid gap-5 p-5 md:grid-cols-2"><section><h4 className="text-sm font-bold text-charcoal">Package summary</h4><dl className="mt-3 divide-y divide-border text-sm"><PreviewRow label="Destination" value={item.destination}/><PreviewRow label="Duration" value={`${item.days} days, ${item.nights} nights`}/><PreviewRow label="Starting price" value={`${item.currency} ${item.price.toLocaleString()}`}/><PreviewRow label="Cover" value={item.coverImage || "Not selected"}/></dl><h4 className="mt-5 text-sm font-bold text-charcoal">Included services</h4><p className="mt-2 text-sm text-stone">{item.services.join(", ") || "None selected"}</p><h4 className="mt-5 text-sm font-bold text-charcoal">Cancellation</h4><p className="mt-2 text-sm leading-5 text-stone">{item.cancellationSummary}</p></section><section><h4 className="text-sm font-bold text-charcoal">Day-by-day itinerary</h4><ol className="mt-3 space-y-3">{item.itinerary.map((day, index) => <li key={index} className="rounded-md border border-border bg-white p-3"><span className="text-xs font-bold text-river">Day {index + 1}</span><p className="mt-1 text-sm text-charcoal">{day || "Not completed"}</p></li>)}</ol>{item.addOns.length > 0 && <><h4 className="mt-5 text-sm font-bold text-charcoal">Optional add-ons</h4><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-stone">{item.addOns.map((addOn) => <li key={addOn}>{addOn}</li>)}</ul></>}</section></div></div>; }
function PreviewRow({ label, value }: { label: string; value: string }) { return <div className="flex justify-between gap-3 py-2"><dt className="text-stone">{label}</dt><dd className="text-right font-semibold text-charcoal">{value}</dd></div>; }
function Info({ label, value }: { label: string; value: string }) { return <span><small className="block text-stone">{label}</small><strong className="mt-1 block truncate text-charcoal">{value}</strong></span>; }
function lines(value: string) { return value.split("\n").map((line) => line.trim()).filter(Boolean); }
function slugify(value: string) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function clonePackage(item: AdminPackage): AdminPackage { return { ...item, services: [...item.services], itinerary: [...item.itinerary], addOns: [...item.addOns], galleryImages: [...item.galleryImages] }; }
function blankPackage(): AdminPackage { return { ...clonePackage(initialPackages[0]), id: `pkg-${Date.now()}`, title: "", slug: "", description: "", destination: "Kalam", packageType: "Couple", tier: "Standard", days: 3, nights: 2, price: 0, currency: "PKR", services: [], itinerary: ["", "", ""], addOns: [], cancellationSummary: "", coverImage: "", galleryImages: [], status: "Inactive", seoTitle: "", seoDescription: "" }; }
