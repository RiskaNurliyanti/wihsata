'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { ImageUpload } from '@/components/shared/image-upload';
import { slugify, cn } from '@/lib/utils';
import { FACILITY_PRESETS } from '@/lib/facility-presets';
import { useState } from 'react';
import type { Category, District, Destination } from '@/types/database.types';
import type { DestinationFormState } from '@/lib/actions/admin.actions';

interface DestinationFormProps {
  action: (prevState: DestinationFormState, formData: FormData) => Promise<DestinationFormState>;
  categories: Category[];
  districts: District[];
  destination?: Destination | null;
  submitLabel?: string;
}

const initialState: DestinationFormState = { error: null };

// Kunci HARUS cocok dengan format `weekday: 'short'` locale en-US yang
// dipakai formatOpeningHours() di halaman detail destinasi (mon/tue/wed/...).
const OPENING_HOURS_DAYS = [
  { key: 'mon', label: 'Senin' },
  { key: 'tue', label: 'Selasa' },
  { key: 'wed', label: 'Rabu' },
  { key: 'thu', label: 'Kamis' },
  { key: 'fri', label: 'Jumat' },
  { key: 'sat', label: 'Sabtu' },
  { key: 'sun', label: 'Minggu' },
] as const;

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="gradient" disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {pending ? 'Menyimpan...' : label}
    </Button>
  );
}

export function DestinationForm({ action, categories, districts, destination, submitLabel = 'Simpan' }: DestinationFormProps) {
  const [state, formAction] = useFormState(action, initialState);
  const [name, setName] = useState(destination?.name ?? '');
  const [slug, setSlug] = useState(destination?.slug ?? '');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!destination);
  const [accessType, setAccessType] = useState(destination?.access_type ?? 'darat');
  const [facilities, setFacilities] = useState<string[]>(destination?.facilities ?? []);
  const [customFacility, setCustomFacility] = useState('');
  // Foto sampul & galeri via file upload; nilai akhirnya tetap dikirim
  // ke API lewat field cover_image_url/gallery_urls seperti biasa.
  const [coverImageUrl, setCoverImageUrl] = useState(destination?.cover_image_url ?? '');
  const [galleryUrls, setGalleryUrls] = useState<string[]>(destination?.gallery_urls ?? []);
  // Jam operasional per hari, mis. {mon: "08:00 - 17:00", ...} — kunci
  // 3-huruf lowercase sesuai yang dipakai halaman detail destinasi.
  const [openingHours, setOpeningHours] = useState<Record<string, string>>(destination?.opening_hours ?? {});

  function toggleFacility(label: string) {
    setFacilities((prev) => (prev.includes(label) ? prev.filter((f) => f !== label) : [...prev, label]));
  }

  function addCustomFacility() {
    const value = customFacility.trim();
    if (!value) return;
    if (!facilities.includes(value)) setFacilities((prev) => [...prev, value]);
    setCustomFacility('');
  }

  function handleNameChange(value: string) {
    setName(value);
    if (!slugManuallyEdited) setSlug(slugify(value));
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={formAction} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Nama Destinasi</Label>
              <Input id="name" name="name" value={name} onChange={(e) => handleNameChange(e.target.value)} required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                name="slug"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugManuallyEdited(true);
                }}
                required
                className="mt-1.5"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea id="description" name="description" defaultValue={destination?.description ?? ''} rows={4} className="mt-1.5" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="category_id">Kategori</Label>
              <div className="mt-1.5">
                <SearchableSelect
                  name="category_id"
                  options={categories.map((c) => ({ value: c.id, label: c.name }))}
                  defaultValue={destination?.category_id ?? null}
                  placeholder="Pilih kategori"
                  searchPlaceholder="Cari kategori..."
                  emptyText="Kategori tidak ditemukan."
                />
              </div>
            </div>
            <div>
              <Label htmlFor="district_id">Kabupaten/Kota</Label>
              <div className="mt-1.5">
                <SearchableSelect
                  name="district_id"
                  options={districts.map((d) => ({ value: d.id, label: d.name }))}
                  defaultValue={destination?.district_id ?? null}
                  placeholder="Pilih kabupaten/kota"
                  searchPlaceholder="Cari kota... (mis. Samarinda)"
                  emptyText="Kota tidak ditemukan."
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input id="latitude" name="latitude" type="number" step="any" defaultValue={destination?.latitude ?? ''} required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input id="longitude" name="longitude" type="number" step="any" defaultValue={destination?.longitude ?? ''} required className="mt-1.5" />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Alamat</Label>
            <Input id="address" name="address" defaultValue={destination?.address ?? ''} className="mt-1.5" />
          </div>

          {/* safety_score opsional; kalau diisi wajib disertai sumber penilaian. */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="safety_score">Safety Score (0–5, opsional)</Label>
              <Input
                id="safety_score"
                name="safety_score"
                type="number"
                min={0}
                max={5}
                step="0.1"
                placeholder="Kosongkan kalau belum ada penilaian"
                defaultValue={destination?.safety_score ?? ''}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="safety_source">Sumber/Dasar Penilaian Keselamatan</Label>
              <Input
                id="safety_source"
                name="safety_source"
                placeholder="mis. Survei lapangan tim Wihsata, Agustus 2026"
                defaultValue={destination?.safety_source ?? ''}
                className="mt-1.5"
              />
            </div>
          </div>
          <p className="-mt-2 text-xs text-muted-foreground">
            Wajib diisi kalau Safety Score diisi — ditampilkan ke pengguna sebagai dasar penilaian. Kalau tidak yakin,
            biarkan kosong; halaman destinasi akan menampilkan &quot;belum tersedia dari sumber terverifikasi&quot;.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="price_range">Harga Tiket</Label>
              <Input id="price_range" name="price_range" placeholder="mis. Rp 10.000 - Rp 25.000" defaultValue={destination?.price_range ?? ''} className="mt-1.5" />
            </div>
            <div>
              <Label>Foto Sampul (utama)</Label>
              <div className="mt-1.5">
                <ImageUpload
                  value={coverImageUrl || null}
                  onUploaded={(url) => setCoverImageUrl(url)}
                  onRemove={() => setCoverImageUrl('')}
                  label="Unggah Foto Sampul"
                />
              </div>
              <input type="hidden" name="cover_image_url" value={coverImageUrl} />
            </div>
          </div>

          <div>
            <Label>Galeri Foto Tambahan</Label>
            <div className="mt-1.5 flex flex-wrap gap-3">
              {galleryUrls.map((url, idx) => (
                <ImageUpload
                  key={url + idx}
                  value={url}
                  onUploaded={() => {}}
                  onRemove={() => setGalleryUrls((prev) => prev.filter((_, i) => i !== idx))}
                />
              ))}
              <ImageUpload
                value={null}
                onUploaded={(url) => setGalleryUrls((prev) => [...prev, url])}
                label="Tambah Foto"
              />
            </div>
            <input type="hidden" name="gallery_urls" value={galleryUrls.join('\n')} />
            <p className="mt-1 text-xs text-muted-foreground">
              Foto-foto ini akan tampil sebagai galeri geser (carousel) di halaman detail destinasi, bersama foto sampul.
              Kualitas foto asli dipertahankan (tidak dikompresi paksa).
            </p>
          </div>

          <div>
            <Label htmlFor="google_maps_url">URL Google Maps</Label>
            <Input id="google_maps_url" name="google_maps_url" placeholder="https://maps.google.com/..." defaultValue={destination?.google_maps_url ?? ''} className="mt-1.5" />
          </div>

          <div>
            <Label>Fasilitas Tersedia</Label>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Pilih fasilitas yang tersedia, atau tambahkan sendiri kalau tidak ada di daftar.
            </p>

            {/* Data sesungguhnya dikirim lewat hidden input ini — formatnya sama
                seperti sebelumnya (satu per baris) supaya parseDestinationForm
                di server tidak perlu diubah sama sekali. */}
            <input type="hidden" name="facilities" value={facilities.join('\n')} />

            <div className="mt-2 flex flex-wrap gap-2">
              {FACILITY_PRESETS.map((item) => {
                const active = facilities.includes(item.label);
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => toggleFacility(item.label)}
                    className={cn(
                      'flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
                      active
                        ? 'border-primary-600 bg-primary-600 text-white'
                        : 'border-border bg-card text-muted-foreground hover:border-primary-300'
                    )}
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    {item.label}
                  </button>
                );
              })}
              {/* Fasilitas custom yang ditambahkan tapi belum ada di daftar preset */}
              {facilities
                .filter((f) => !FACILITY_PRESETS.some((p) => p.label === f))
                .map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => toggleFacility(f)}
                    className="rounded-full border border-primary-600 bg-primary-600 px-3.5 py-1.5 text-sm font-medium text-white"
                  >
                    {f} ✕
                  </button>
                ))}
            </div>

            <div className="mt-3 flex gap-2">
              <Input
                value={customFacility}
                onChange={(e) => setCustomFacility(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomFacility();
                  }
                }}
                placeholder="Fasilitas lain, mis. Ruang Ganti, Charging Station..."
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={addCustomFacility}>
                Tambah
              </Button>
            </div>
          </div>

          {/* Jam operasional per hari — input teks bebas, mis. "08:00 - 17:00" atau "Tutup". */}
          <div className="rounded-lg border border-border p-4">
            <Label>Jam Operasional</Label>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Isi per hari, mis. &quot;08:00 - 17:00&quot; atau &quot;Tutup&quot;. Kosongkan kalau tidak ada info.
            </p>
            <div className="mt-3 space-y-2">
              {OPENING_HOURS_DAYS.map((day) => (
                <div key={day.key} className="flex items-center gap-3">
                  <span className="w-20 shrink-0 text-sm text-muted-foreground">{day.label}</span>
                  <Input
                    value={openingHours[day.key] ?? ''}
                    onChange={(e) =>
                      setOpeningHours((prev) => {
                        const next = { ...prev };
                        if (e.target.value.trim()) next[day.key] = e.target.value;
                        else delete next[day.key];
                        return next;
                      })
                    }
                    placeholder="08:00 - 17:00"
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
            <input type="hidden" name="opening_hours" value={JSON.stringify(openingHours)} />
          </div>

          <div className="rounded-lg border border-border p-4">
            <Label htmlFor="access_type">Akses Menuju Destinasi</Label>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Penting untuk destinasi di pulau — supaya fitur Nearby & AI Planner tahu perlu naik kapal, bukan cuma
              hitung jarak garis lurus yang menyesatkan.
            </p>
            <Select name="access_type" value={accessType} onValueChange={(v) => setAccessType(v as typeof accessType)}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="darat">Darat (bisa langsung dijangkau)</SelectItem>
                <SelectItem value="kapal">Kapal (wajib naik kapal/perahu)</SelectItem>
                <SelectItem value="kombinasi">Kombinasi (darat lalu nyambung kapal)</SelectItem>
              </SelectContent>
            </Select>

            {accessType !== 'darat' && (
              <div className="mt-4 space-y-4 border-t border-border pt-4">
                <div>
                  <Label htmlFor="departure_port">Pelabuhan/Dermaga Keberangkatan</Label>
                  <Input
                    id="departure_port"
                    name="departure_port"
                    placeholder="mis. Pelabuhan Kapal Feri Kariangau"
                    defaultValue={destination?.departure_port ?? ''}
                    className="mt-1.5"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="crossing_duration_minutes">Estimasi Durasi Penyeberangan (menit)</Label>
                    <Input
                      id="crossing_duration_minutes"
                      name="crossing_duration_minutes"
                      type="number"
                      min={0}
                      placeholder="mis. 45"
                      defaultValue={destination?.crossing_duration_minutes ?? ''}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="crossing_cost_estimate">Estimasi Biaya Kapal (Rp/orang)</Label>
                    <Input
                      id="crossing_cost_estimate"
                      name="crossing_cost_estimate"
                      type="number"
                      min={0}
                      placeholder="mis. 25000"
                      defaultValue={destination?.crossing_cost_estimate ?? ''}
                      className="mt-1.5"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="crossing_notes">Catatan Penyeberangan (opsional)</Label>
                  <Textarea
                    id="crossing_notes"
                    name="crossing_notes"
                    placeholder="mis. kapal hanya beroperasi pagi hari, cuaca buruk bisa dibatalkan"
                    defaultValue={destination?.crossing_notes ?? ''}
                    rows={2}
                    className="mt-1.5"
                  />
                </div>
              </div>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" name="is_featured" defaultChecked={destination?.is_featured ?? false} className="h-4 w-4 rounded border-border" />
            Tampilkan sebagai destinasi unggulan (Featured)
          </label>

          {state.error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {state.error}
            </div>
          )}

          <SubmitButton label={submitLabel} />
        </form>
      </CardContent>
    </Card>
  );
}
