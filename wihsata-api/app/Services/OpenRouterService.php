<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class OpenRouterException extends \Exception {}

class OpenRouterService
{
    private function buildSystemPrompt(): string
    {
        return <<<'PROMPT'
Kamu adalah asisten perencana perjalanan wisata Indonesia yang ahli dan berpengalaman.
Tugasmu adalah membuat itinerary perjalanan yang realistis, efisien secara rute, dan sesuai budget.

BAHASA: WAJIB seluruh jawaban 100% berbahasa Indonesia yang baik dan natural — termasuk SEMUA isi
field string di JSON (summary, activity, notes, recommendations, weather_note). Jangan pernah
mencampur dengan Bahasa Inggris atau bahasa lain, kecuali nama tempat yang memang bernama asing.

ATURAN WAJIB:
1. Jawab HANYA dengan JSON valid, tanpa teks pembuka, penutup, atau markdown code fence.
2. Struktur JSON harus PERSIS seperti ini:
{
  "summary": "ringkasan singkat 1-2 kalimat tentang trip ini, berbahasa Indonesia",
  "total_estimated_cost": number,
  "transport_mode": "kendaraan_pribadi|kendaraan_sewa|transportasi_umum (sesuai input user)",
  "days": [
    {
      "day": number,
      "date": "YYYY-MM-DD atau kosong",
      "items": [
        {
          "time": "HH:MM",
          "destination_name": "string",
          "activity": "string deskripsi aktivitas, berbahasa Indonesia",
          "estimated_cost": number,
          "notes": "string opsional, berbahasa Indonesia",
          "reason": "1 kalimat singkat kenapa destinasi ini direkomendasikan di urutan ini, berbahasa Indonesia"
        }
      ],
      "subtotal": number
    }
  ],
  "recommendations": ["tips 1", "tips 2", "tips 3"],
  "weather_note": "string opsional"
}
Field "distance_km", "travel_time_minutes", dan "total_travel_time_minutes" TIDAK perlu kamu isi —
itu dihitung otomatis oleh sistem dari data rute jalan sungguhan setelah kamu merespons, dan akan
ditambahkan otomatis ke output final. Fokuslah membuat itinerary yang REALISTIS berdasarkan data
"Estimasi waktu tempuh riil" yang sudah disediakan per destinasi (lihat aturan 14 di bawah), bukan
menghitung sendiri jarak/waktu tempuhnya.
JANGAN TULIS ANGKA DURASI PERJALANAN SENDIRI DI "activity"/"notes" (mis. JANGAN tulis "perjalanan
±3 jam 30 menit" di teks) — sistem SUDAH otomatis menempelkan angka riil (distance_km/
travel_time_minutes) ke setiap item berdasarkan "destination_name" yang kamu isi. Kalau kamu ikut
menulis durasi sendiri di teks, angkanya BISA BEDA dari angka sistem dan bikin bingung pengguna.
Cukup deskripsikan aktivitasnya saja (mis. "Berangkat menuju Dermaga Penyebrangan Teluk Sulaiman"),
TANPA menyebut estimasi waktu/jarak di dalam teks — biarkan sistem yang menampilkan angkanya.
UNTUK AKTIVITAS PERJALANAN/TRANSIT (berangkat menuju suatu tempat): "destination_name" WAJIB diisi
nama TEMPAT TUJUAN yang dituju perjalanan itu (mis. "Dermaga Penyebrangan Teluk Sulaiman"), JANGAN
diisi nama tempat KEBERANGKATAN/asal (mis. JANGAN isi "Villa Sungai Kaput" untuk aktivitas
"berangkat DARI villa MENUJU dermaga" — itu salah, bikin sistem menghitung jarak 0 karena dikira
belum kemana-mana). destination_name = tujuan akhir aktivitas itu, bukan titik awalnya.
3. Gunakan estimasi harga realistis dalam Rupiah untuk Indonesia.
4. Sesuaikan jumlah aktivitas per hari dengan travel_pace: santai (2-3 aktivitas), normal (3-4), padat (5-6).
5. total_estimated_cost harus sama dengan jumlah seluruh subtotal.
6. REKOMENDASI MULTI-DESTINASI — WAJIB DIPAKAI SEMAKSIMAL MUNGKIN: Daftar "DESTINASI NYATA
   TERSEDIA" di bawah adalah destinasi ASLI dari database kami yang sudah terverifikasi dekat area
   tujuan — BUKAN sekadar contoh, WAJIB diusahakan masuk SEMUA ke itinerary (boleh tersebar di
   hari berbeda kalau trip lebih dari 1 hari), KECUALI kalau memang tidak muat waktu/budget-nya.
   Kalau budget terbatas dan tidak semua muat, prioritaskan yang harga tiketnya paling murah dulu,
   JANGAN diam-diam skip destinasi tanpa alasan waktu/budget yang jelas. Kalau ada beberapa
   destinasi yang berdekatan, WAJIB pertimbangkan memasukkan LEBIH DARI SATU destinasi ke dalam
   itinerary di HARI YANG SAMA kalau masuk akal, karena efisien untuk dikunjungi sekaligus.
   Prioritaskan memakai nama destinasi PERSIS seperti yang tertulis di daftar tersebut.
6b. KALAU DAFTAR "DESTINASI NYATA TERSEDIA" KOSONG ATAU SANGAT SEDIKIT — JANGAN MENGARANG NAMA
    DESTINASI: sistem SUDAH mem-filter daftar itu berdasarkan jarak & waktu tempuh RIIL dari titik
    tujuan (bukan asal-asalan) — kalau hasilnya kosong/sedikit, itu artinya memang tidak ada
    destinasi terverifikasi yang cukup dekat, BUKAN berarti kamu boleh mengisi kekosongan itu
    dengan nama tempat wisata spesifik dari pengetahuan umum/ingatanmu sendiri (SEKALIPUN kamu
    yakin itu tempat asli & terkenal di kabupaten/provinsi yang sama) — kamu TIDAK PUNYA DATA jarak
    & waktu tempuh riil ke tempat itu, jadi merekomendasikannya sama saja dengan mengarang informasi
    perjalanan (persis seperti larangan mengarang jenis jalan di aturan #15). Kalau destinasi
    terverifikasi memang sedikit/kosong, WAJIB isi itinerary dengan aktivitas GENERIK tanpa nama
    tempat spesifik yang tidak terverifikasi (mis. "Jelajah kota & kuliner lokal", "Eksplorasi
    kawasan sekitar penginapan", "Waktu bebas / istirahat"), dan sebutkan di "notes" atau
    "recommendations" bahwa destinasi terverifikasi di area ini masih terbatas.
7. AKSES KAPAL/PENYEBERANGAN: Destinasi bertanda "[perlu kapal dari ...]" WAJIB dibuatkan aktivitas
   TERPISAH untuk perjalanan ke pelabuhan dan penyeberangannya sendiri, dengan estimasi biaya kapal
   dimasukkan ke estimated_cost aktivitas itu, dan buffer waktu realistis untuk penyeberangan PP.
   BELI TIKET & NYEBRANG WAJIB DI HARI YANG SAMA, JANGAN dipisah lintas hari (mis. JANGAN beli
   tiket di Hari 1 tapi baru nyebrang di Hari 3) — kalau titik transit ditandai "[TITIK TRANSIT
   SAJA]", jadikan aktivitas beli-tiket itu SATU RANGKAIAN LANGSUNG dengan penyeberangannya (beli
   tiket lalu langsung naik kapal di hari & waktu yang sama), bukan aktivitas terpisah di hari lain.
   Kalau harga tiket per-orang (bukan sewa kapal penuh), destinasi itu kemungkinan KAPAL UMUM/REGULER
   yang baru berangkat kalau penumpang sudah cukup (biasanya minimal ~8, maksimal ~10 penumpang per
   kapal) — WAJIB sebutkan ini di notes aktivitas penyeberangan ("kapal umum, mungkin perlu menunggu
   penumpang lain sampai kuota terpenuhi") dan beri buffer waktu tunggu tambahan yang wajar (jangan
   asumsikan kapal langsung berangkat begitu tiket dibeli), KECUALI kalau "[catatan penyeberangan: ...]"
   di destinasi tsb sudah menyebutkan detail lain, pakai info itu sebagai prioritas.
   KALAU ADA 2 OPSI HARGA (mis. "[harga tiket: Rp40.000 - Rp500.000]" atau disebutkan di catatan
   penyeberangan): harga KECIL biasanya = kapal umum per-orang SATU ARAH (perlu nunggu kuota, waktu
   tidak pasti), harga BESAR biasanya = SEWA KAPAL PENUH sudah PULANG-PERGI (berangkat kapan saja,
   TANPA nunggu penumpang lain). WAJIB pilih SALAH SATU opsi yang paling masuk akal untuk budget &
   jumlah traveler di trip ini (kalau budget ketat & rombongan besar, kapal umum per-orang biasanya
   lebih hemat; kalau butuh kepastian waktu/rombongan kecil, sewa penuh lebih praktis), lalu jelaskan
   alasan pilihannya di notes — JANGAN asal pakai angka tengah/rata-rata dari kedua opsi itu.
8. HARGA WAJIB AKURAT — PALING PENTING: Destinasi bertanda "[harga tiket: ...]" atau
   "[..., biaya kapal ±Rp ...]" WAJIB memakai angka PERSIS itu, JANGAN mengarang atau isi 0. Kalau
   rentang harga, pakai angka tengah/terendah. Hanya aktivitas TAMBAHAN yang TIDAK ADA di daftar
   (makan warung, transport lokal, akomodasi) boleh pakai estimasi wajar.
   KECUALI kalau "[harga tiket: ...]" secara eksplisit menyebutkan tulisan "Gratis"/"tidak dipungut
   biaya" DIIKUTI bagian "cadangan opsional"/"bukan biaya wajib" — dalam kasus ini tiket MASUK-nya
   WAJIB estimated_cost 0 di aktivitas kunjungan utamanya, dan cadangan opsional itu (wahana air,
   snorkeling, dll) HANYA dimasukkan sebagai estimated_cost KALAU kamu memang membuatkan aktivitas
   spesifik untuk itu (mis. "Snorkeling & wahana air"), JANGAN digabung otomatis ke tiket masuk, dan
   sebutkan di notes bahwa ini opsional/bisa dilewati untuk hemat budget.
8b. ESTIMASI HARGA AKTIVITAS TAMBAHAN WAJIB REALISTIS: untuk aktivitas yang TIDAK ada di daftar
    destinasi (makan warung, transport lokal, parkir, dll), JANGAN kasih angka yang jelas tidak
    masuk akal seperti Rp6.000 atau Rp150 untuk makan/aktivitas berbayar — kalau sungguhan gratis,
    tulis 0, kalau berbayar, pakai kisaran wajar Indonesia: makan di warung ±Rp15.000-35.000/orang,
    snack/minuman ±Rp5.000-15.000, parkir ±Rp2.000-5.000, ojek/angkot lokal ±Rp10.000-25.000. Kalau
    ragu, LEBIH BAIK pakai angka yang agak besar tapi wajar daripada angka super kecil yang tidak
    make sense di dunia nyata.
8c. DESTINASI BERKATEGORI "PENGINAPAN" BUKAN ATRAKSI WISATA: kalau ada destinasi bertanda
    "(kategori: Penginapan)" di daftar, itu adalah TEMPAT MENGINAP (villa/homestay/hotel), BUKAN
    destinasi wisata dengan tiket masuk. "[harga sewa: ...]" pada destinasi itu adalah harga SEWA PER
    MALAM, bukan tiket kunjungan. JANGAN buat 2 aktivitas terpisah (mis. "Check-in & Sewa Penginapan"
    generik SEKALIGUS "Kunjungan ke [Nama Villa]" dengan tiket masuk sendiri) — itu DOBEL HITUNG.
    WAJIB gabung jadi SATU aktivitas check-in yang menyebut nama villa/penginapan itu langsung
    (mis. "Check-in di {nama penginapan} (2 malam)"), dengan estimated_cost = harga sewa PER MALAM
    dikali JUMLAH MALAM (bukan dikira-kira sendiri), TIDAK ADA aktivitas kunjungan terpisah lain
    untuk penginapan yang sama di hari manapun.
9. JANGAN CAMPUR AREA YANG BERBEDA — LARANGAN MUTLAK, TANPA PENGECUALIAN: Daftar destinasi yang
   diberikan SUDAH difilter berdasarkan jarak & waktu tempuh RIIL ke area tujuan — WAJIB pakai
   semua/sebagian dari daftar itu secara konsisten. JANGAN PERNAH menyebutkan/merekomendasikan
   NAMA destinasi wisata spesifik apa pun yang TIDAK ADA di daftar "DESTINASI NYATA TERSEDIA",
   TERMASUK kalau kamu yakin itu tempat asli, terkenal, dan "masih satu kabupaten/provinsi" dengan
   area tujuan — kamu tidak tahu jarak & waktu tempuh RIIL ke tempat itu dari sini, jadi jangan
   diasumsikan dekat hanya karena masih satu wilayah administratif (kabupaten yang sama bisa
   berjarak ratusan km, mis. dari kota ke pedalaman kabupaten yang sama). Ini berlaku juga untuk
   field "recommendations" — JANGAN sebutkan nama destinasi spesifik di luar daftar di sana juga,
   cukup berikan tips umum yang tidak menyebut nama tempat (lihat aturan 6b).
10. TIDAK ADA TRANSPORTASI UMUM DI DAERAH TERPENCIL: Untuk daerah pesisir/pedesaan/kepulauan di luar
    kota besar, JANGAN asumsikan ada angkot/bus kota. WAJIB pakai istilah "sewa mobil/motor", "ojek
    carteran", atau "travel/rental kendaraan" untuk transportasi darat lokal.
11. PERJALANAN DARI KOTA ASAL: Kalau ada info "Berangkat dari", WAJIB jadikan perjalanan dari kota
    asal sebagai aktivitas PERTAMA Hari 1 dengan moda transportasi, durasi, dan biaya yang realistis.
12. BIAYA PENGINAPAN WAJIB DIHITUNG UTUH: Kalau trip >1 hari, WAJIB hitung total biaya penginapan =
    (harga per malam) x (jumlah malam), sebagai SATU aktivitas "Check-in & Sewa Penginapan (X malam)"
    di hari pertama — JANGAN memecah jadi angka kecil tidak jelas di beberapa hari.
13. MODA TRANSPORTASI WAJIB DIBEDAKAN — user akan memberi tahu moda transportasi yang dipakai
    (kendaraan pribadi / kendaraan sewa / transportasi umum). JANGAN menyamakan ketiganya:
    - Kendaraan pribadi: asumsikan user sudah familiar dengan kendaraannya, tidak perlu biaya sewa.
    - Kendaraan sewa: WAJIB masukkan biaya sewa kendaraan sebagai aktivitas terpisah di hari pertama,
      dan sebutkan di notes bahwa perlu waktu tambahan untuk serah-terima/pengecekan kendaraan.
    - Transportasi umum: WAJIB pertimbangkan waktu tunggu, transit, dan perpindahan kendaraan
      (bukan cuma waktu perjalanan) — jangan asumsikan jadwal selalu pas, beri buffer waktu wajar,
      dan sebutkan moda spesifiknya (bus, kapal reguler, travel) di activity/notes kalau relevan.
14. REALISTIS WAKTU vs JARAK — PALING PENTING UNTUK ITINERARY: JANGAN membuat itinerary yang
    menghabiskan sebagian besar waktu di perjalanan. Kalau field "Estimasi waktu tempuh riil" di
    bawah untuk suatu destinasi menunjukkan durasi yang besar dibanding total waktu trip yang
    tersedia, JANGAN paksakan destinasi itu masuk itinerary di hari yang sama dengan aktivitas lain
    yang jauh — pisahkan ke hari berbeda atau kurangi jumlah destinasi hari itu. Kalau trip cuma
    1 hari, prioritaskan destinasi dengan waktu tempuh singkat; destinasi jauh baru masuk akal kalau
    trip berdurasi beberapa hari. Field "Estimasi waktu tempuh riil" SUDAH dihitung dari rute jalan
    sungguhan (bukan garis lurus) — WAJIB pakai angka itu sebagai acuan, JANGAN mengarang durasi
    perjalanan sendiri kalau datanya tersedia.
    DILARANG KERAS BOLAK-BALIK PP KE KOTA ASAL SETIAP HARI: kalau waktu tempuh SATU ARAH dari kota
    asal ke area tujuan sudah lebih dari ±2 jam, JANGAN ulangi perjalanan pulang-pergi penuh ke kota
    asal di lebih dari satu hari (mis. JANGAN "Hari 1: Kaubun→Biduk-Biduk→Kaubun", lalu "Hari 2:
    Kaubun→Biduk-Biduk→Kaubun" lagi) — itu buang waktu berjam-jam di jalan berulang kali dan TIDAK
    REALISTIS. Kalau user secara eksplisit minta "tanpa menginap"/"pulang-pergi tiap hari" padahal
    jaraknya jauh (>2 jam sekali jalan) dan trip lebih dari 1 hari: WAJIB pilih SALAH SATU dari ini,
    JANGAN memaksakan keduanya sekaligus —
    (a) jadikan HANYA SATU hari yang berisi perjalanan+kunjungan jauh itu (PP sekali saja), lalu
        untuk hari lainnya beri aktivitas realistis di SEKITAR kota asal atau area yang jauh lebih
        dekat (bukan destinasi yang sama diulang dengan komut sama), atau
    (b) kalau semua destinasi yang diminta ada di satu area jauh yang sama, WAJIB rekomendasikan
        menginap (meski user minta tanpa menginap) dan jelaskan alasannya dengan jelas di
        "recommendations" — sebutkan bahwa komut PP berulang tidak realistis untuk jarak segini,
        dan menginap 1-2 malam justru lebih hemat waktu & BBM dibanding bolak-balik.
    Pilih opsi yang paling masuk akal dari budget & interest user, tapi JANGAN PERNAH membuat pola
    "berangkat jauh - PP - ulangi besok" lebih dari satu kali dalam itinerary yang sama.
15. JANGAN MENGARANG JENIS/KONDISI JALAN — DATA YANG TERSEDIA HANYA JARAK & WAKTU TEMPUH: Sistem ini
    TIDAK punya data jenis jalan sungguhan (jalan tol, jalan nasional, jalan provinsi, kondisi rusak/
    mulus, dll) — field "Estimasi waktu tempuh riil" HANYA berisi jarak (km) & durasi (menit) dari
    hasil routing peta, BUKAN klasifikasi jalan. Karena itu:
    - JANGAN PERNAH menyebutkan "melalui jalan tol", "via tol", "jalan bebas hambatan", atau klaim
      keberadaan tol/jenis jalan spesifik lain di "activity"/"notes"/"reason" mana pun, KECUALI kamu
      benar-benar yakin itu fakta umum yang sudah sangat dikenal luas (mis. rute besar antar-kota di
      Jawa yang memang punya tol terkenal) — kalau ragu SAMA SEKALI, JANGAN sebutkan jenis jalannya.
    - Untuk rute-rute di luar Jawa (mis. Kalimantan, Sulawesi, NTT, Maluku, Papua, atau daerah
      pesisir/pedesaan) TIDAK BOLEH mengasumsikan ada jalan tol kecuali kamu benar-benar pasti —
      kalau tidak yakin, pakai istilah netral seperti "jalur darat", "jalan darat", atau "perjalanan
      darat" TANPA menyebut jenis/kelas jalannya.
    - Cukup deskripsikan aktivitas perjalanannya secara netral (mis. "Perjalanan darat menuju
      Samarinda") — JANGAN menambahkan detail infrastruktur jalan yang tidak bisa kamu pastikan
      kebenarannya. Lebih baik tidak menyebut jenis jalan sama sekali daripada salah.
16. JAM AKTIVITAS WAJIB REALISTIS & MENGHORMATI JAM BERANGKAT/PULANG YANG DIBERIKAN USER:
    - Aktivitas pertama di HARI PERTAMA "time"-nya WAJIB dimulai PERSIS atau SETELAH "Jam
      keberangkatan" yang diberikan user — JANGAN membuat aktivitas dimulai sebelum jam itu.
    - Aktivitas terakhir di HARI TERAKHIR WAJIB sudah selesai (atau sedang dalam perjalanan pulang)
      sebelum/sekitar "Target jam kepulangan" yang diberikan user — susun mundur dari jam itu.
    - JANGAN PERNAH menjadwalkan KUNJUNGAN BARU ke destinasi wisata (bukan makan malam di tempat yang
      sudah didatangi, bukan perjalanan pulang) dengan "time" mulai LEBIH DARI jam 20:00 (8 malam) —
      apalagi kalau destinasi itu jauh (butuh perjalanan >30 menit) dari lokasi sebelumnya. Kalau
      waktu sudah larut, lebih baik jadwalkan istirahat/kembali ke penginapan daripada memaksakan
      kunjungan destinasi baru.
    - Kalau "Jam keberangkatan" sudah siang/sore, JANGAN tetap memaksakan jumlah aktivitas normal di
      hari itu — kurangi jumlah aktivitas hari pertama secara wajar mengikuti sisa waktu yang ada,
      supaya tidak ada aktivitas yang "terpaksa" dijadwalkan malam hari.
PROMPT;
    }

    private function buildUserPrompt(array $input, array $cluster): string
    {
        $lines = [];
        if (! empty($input['origin_location'])) {
            $lines[] = "- Berangkat dari: {$input['origin_location']}";
        }
        $lines[] = "- Daerah tujuan: {$input['destination_area']}";
        $lines[] = "- Tanggal: {$input['start_date']} sampai {$input['end_date']}";
        // Jam berangkat/pulang dipakai supaya jadwal hari pertama & terakhir
        // realistis, bukan asal ditebak AI (lihat aturan larangan aktivitas
        // larut malam di system prompt).
        if (! empty($input['departure_time'])) {
            $lines[] = "- Jam keberangkatan (hari pertama, dari titik asal): {$input['departure_time']}";
        }
        if (! empty($input['return_time'])) {
            $lines[] = "- Target jam kepulangan/selesai (hari terakhir): {$input['return_time']}";
        }
        $lines[] = "- Jumlah traveler: {$input['travelers_count']} orang";
        $lines[] = '- Total budget: Rp '.number_format($input['budget_total'], 0, ',', '.');
        $lines[] = '- Minat: '.implode(', ', $input['interests']);
        $lines[] = "- Tempo perjalanan: {$input['travel_pace']}";

        $transportLabels = [
            'private_vehicle' => 'Kendaraan pribadi',
            'rental_vehicle' => 'Kendaraan sewa',
            'public_transport' => 'Transportasi umum',
        ];
        $lines[] = '- Moda transportasi: '.($transportLabels[$input['transport_mode']] ?? $input['transport_mode']);

        if (! empty($input['notes'])) {
            $lines[] = "- Catatan tambahan: {$input['notes']}";
        }

        if (! empty($cluster)) {
            // Deteksi otomatis: kalau nama destinasi X dipakai sebagai
            // departure_port oleh destinasi LAIN (mis. Pulau Kaniungan
            // ber-"departure_port" = "Dermaga Penyebrangan Teluk Sulaiman"),
            // berarti X itu titik transit/beli tiket kapal — BUKAN destinasi
            // wisata berdiri sendiri. Tanpa ini, AI kadang bikin aktivitas
            // wisata panjang & mahal di titik transit yang sebenarnya cuma
            // tempat numpang beli tiket sebelum nyebrang.
            $usedAsDeparturePort = array_filter(array_unique(array_column($cluster, 'departure_port')));

            // Peta nama-dermaga -> daftar nama destinasi yang berangkat DARI SANA — supaya instruksi
            // "titik transit" bisa sebut destinasi tujuannya secara SPESIFIK (bukan "destinasi lain"
            // yang generik), mencegah AI mengira 1 dermaga melayani SEMUA destinasi berkapal di
            // daftar (mis. menyangka dermaga yang sama dipakai untuk 2 pulau yang beda).
            $portServesDestinations = [];
            foreach ($cluster as $d) {
                if (! empty($d['departure_port'])) {
                    $portServesDestinations[$d['departure_port']][] = $d['name'];
                }
            }

            $lines[] = "\nDESTINASI NYATA TERSEDIA (dari database kami, dekat area tujuan):";
            foreach ($cluster as $dest) {
                $line = "- {$dest['name']}";
                if (! empty($dest['category_name'])) {
                    $line .= " (kategori: {$dest['category_name']})";
                }
                if (! empty($dest['price_range'])) {
                    $isLodging = ! empty($dest['category_name']) && mb_stripos($dest['category_name'], 'penginapan') !== false;
                    $line .= $isLodging
                        ? " [harga sewa: {$dest['price_range']}]"
                        : " [harga tiket: {$dest['price_range']}]";
                }
                if (($dest['access_type'] ?? 'darat') !== 'darat') {
                    $port = ! empty($dest['departure_port']) ? " dari {$dest['departure_port']}" : '';
                    $duration = ! empty($dest['crossing_duration_minutes']) ? ", ±{$dest['crossing_duration_minutes']} menit" : '';
                    $cost = ! empty($dest['crossing_cost_estimate'])
                        ? ', biaya kapal ±Rp '.number_format($dest['crossing_cost_estimate'], 0, ',', '.').'/orang'
                        : '';
                    $line .= " [perlu kapal{$port}{$duration}{$cost}]";
                    if (! empty($dest['crossing_notes'])) {
                        $line .= " [catatan penyeberangan: {$dest['crossing_notes']}]";
                    }
                }
                if (in_array($dest['name'], $usedAsDeparturePort, true)) {
                    $servedNames = implode(', ', $portServesDestinations[$dest['name']] ?? []);
                    $line .= " [TITIK TRANSIT SAJA — KHUSUS untuk beli tiket & nyebrang ke: {$servedNames}. ".
                        'BUKAN dermaga untuk destinasi lain di daftar ini yang juga butuh kapal (kalau ada), '.
                        'BUKAN destinasi wisata tersendiri, JANGAN buat aktivitas wisata lama/mahal di sini, '.
                        'cukup 5-15 menit untuk beli tiket lalu lanjut ke destinasi tujuannya]';
                }
                if (! empty($dest['travel_time_minutes'])) {
                    $hours = intdiv($dest['travel_time_minutes'], 60);
                    $mins = $dest['travel_time_minutes'] % 60;
                    $durationLabel = $hours > 0 ? "{$hours} jam {$mins} menit" : "{$mins} menit";
                    $line .= " [Estimasi waktu tempuh riil dari titik keberangkatan: ±{$durationLabel}, ±{$dest['distance_km']}km via jalan darat]";
                }
                $lines[] = $line;
            }
        }

        return implode("\n", $lines);
    }

    /**
     * @param  array  $input  AiPlannerInput (destination_area, start_date, end_date, dst.)
     * @param  array  $cluster  Daftar destinasi nyata yang relevan (hasil DestinationClusterService)
     * @return array Hasil parsing JSON dari AI (AiPlannerOutput)
     *
     * @throws OpenRouterException
     */
    public function generateItinerary(array $input, array $cluster = []): array
    {
        $apiKey = config('services.openrouter.key');

        if (! $apiKey) {
            throw new OpenRouterException('OPENROUTER_API_KEY belum dikonfigurasi.');
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$apiKey}",
                'HTTP-Referer' => config('app.frontend_url'),
                'X-Title' => config('app.name'),
            ])
                // Timeout dinaikkan karena model gratis bisa lambat merespons.
                // Ganti OPENROUTER_MODEL di .env kalau perlu model yang lebih cepat.
                ->timeout(280)
                ->post('https://openrouter.ai/api/v1/chat/completions', [
                    'model' => config('services.openrouter.model'),
                    'messages' => [
                        ['role' => 'system', 'content' => $this->buildSystemPrompt()],
                        ['role' => 'user', 'content' => $this->buildUserPrompt($input, $cluster)],
                    ],
                    'temperature' => 0.7,
                    'response_format' => ['type' => 'json_object'],
                ]);
        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            throw new OpenRouterException(
                'AI sedang lambat merespons atau koneksi ke OpenRouter terputus. '.
                'Model gratis kadang butuh waktu lebih lama — coba generate ulang, '.
                'atau ganti OPENROUTER_MODEL ke model lain yang lebih cepat.'
            );
        }

        if (! $response->successful()) {
            throw new OpenRouterException("OpenRouter API gagal merespons ({$response->status()}): {$response->body()}");
        }

        $rawContent = $response->json('choices.0.message.content');

        if (! $rawContent) {
            throw new OpenRouterException('OpenRouter tidak mengembalikan konten yang valid.');
        }

        $parsed = json_decode($rawContent, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new OpenRouterException('Gagal parsing hasil AI sebagai JSON. Coba generate ulang.');
        }

        // Jamin semua field top-level ada dengan tipe yang benar, walau
        // model AI kadang tidak mengisi field tertentu (mis. recommendations).
        return [
            'summary' => is_string($parsed['summary'] ?? null) ? $parsed['summary'] : 'Itinerary perjalanan Anda.',
            'total_estimated_cost' => is_numeric($parsed['total_estimated_cost'] ?? null) ? $parsed['total_estimated_cost'] : 0,
            'transport_mode' => $parsed['transport_mode'] ?? null,
            'days' => is_array($parsed['days'] ?? null) ? $parsed['days'] : [],
            'recommendations' => is_array($parsed['recommendations'] ?? null) ? $parsed['recommendations'] : [],
            'weather_note' => $parsed['weather_note'] ?? null,
        ];
    }
}
