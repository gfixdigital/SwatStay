import { Search } from "lucide-react";

export function SearchInput({ value, onChange, placeholder = "Search" }: { value: string; onChange: (value: string) => void; placeholder?: string }) { return <label className="relative block"><span className="sr-only">{placeholder}</span><Search className="absolute left-3 top-2.5 text-stone" size={16}/><input className="field pl-9" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder}/></label>; }
