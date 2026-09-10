const pickupCities = ["Islamabad", "Rawalpindi", "Peshawar", "Lahore", "Mingora", "Saidu Sharif"];

export function PickupCityField({ name = "pickupCity", defaultValue = "", className = "" }: { name?: string; defaultValue?: string; className?: string }) {
  const listId = `${name}-suggestions`;
  return <label className={`text-xs font-semibold text-stone ${className}`}>Pickup city<input required name={name} defaultValue={defaultValue} list={listId} className="field mt-1 w-full" placeholder="Choose or enter another city"/><datalist id={listId}>{pickupCities.map((city) => <option key={city} value={city}/>)}</datalist><span className="mt-1 block text-[11px] font-normal leading-4 text-stone">Choose a suggestion or type a different city.</span></label>;
}
