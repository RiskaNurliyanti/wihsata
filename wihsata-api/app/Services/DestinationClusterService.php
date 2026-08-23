<?php

namespace App\Services;

class DestinationClusterService
{
    /** Hitung jarak garis lurus (km) antara 2 koordinat pakai formula Haversine. */
    public function haversineKm(float $lat1, float $lng1, float $lat2, float $lng2): float
    {
        $earthRadiusKm = 6371;
        $dLat = deg2rad($lat2 - $lat1);
        $dLng = deg2rad($lng2 - $lng1);

        $a = sin($dLat / 2) ** 2 + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dLng / 2) ** 2;

        return 2 * $earthRadiusKm * asin(sqrt($a));
    }

    /**
     * Kelompokkan destinasi yang jaraknya <= $maxKm satu sama lain jadi satu
     * grup (union-find), lalu kembalikan HANYA grup yang paling dekat dengan
     * titik pencarian ($searchLat, $searchLng) — bukan semua grup.
     *
     * Ini pengganti clusterByProximity() + logic pemilihan cluster terdekat
     * yang sebelumnya ada di Next.js route.ts (root-cause fix untuk bug AI
     * Planner yang dulu suka salah pilih destinasi jauh, mis. Pulau Miang
     * padahal user minta area Biduk-Biduk).
     *
     * @param  array<int, array{id: string, name: string, latitude: float, longitude: float}>  $destinations
     * @return array<int, array>
     */
    public function closestCluster(array $destinations, float $searchLat, float $searchLng, float $maxKm = 70): array
    {
        if (empty($destinations)) {
            return [];
        }

        $n = count($destinations);
        $parent = range(0, $n - 1);

        $find = function (int $i) use (&$find, &$parent) {
            if ($parent[$i] !== $i) {
                $parent[$i] = $find($parent[$i]);
            }

            return $parent[$i];
        };

        for ($i = 0; $i < $n; $i++) {
            for ($j = $i + 1; $j < $n; $j++) {
                $dist = $this->haversineKm(
                    $destinations[$i]['latitude'], $destinations[$i]['longitude'],
                    $destinations[$j]['latitude'], $destinations[$j]['longitude']
                );

                if ($dist <= $maxKm) {
                    $rootI = $find($i);
                    $rootJ = $find($j);
                    if ($rootI !== $rootJ) {
                        $parent[$rootI] = $rootJ;
                    }
                }
            }
        }

        // Destinasi terdekat dengan titik pencarian (index 0, karena caller
        // sudah mengurutkan berdasarkan distance_km ascending sebelumnya).
        $closestIndex = 0;

        $rootOfClosest = $find($closestIndex);
        $cluster = [];

        for ($i = 0; $i < $n; $i++) {
            if ($find($i) === $rootOfClosest) {
                $cluster[] = $destinations[$i];
            }
        }

        // Batasi hasil akhir hanya destinasi yang jaraknya langsung (bukan
        // transitif lewat destinasi perantara) ke titik pencarian <= $maxKm —
        // mencegah union-find "meloncat" ke kota lain lewat destinasi di tengah.
        return array_values(array_filter($cluster, function ($destination) use ($searchLat, $searchLng, $maxKm) {
            return $this->haversineKm($destination['latitude'], $destination['longitude'], $searchLat, $searchLng) <= $maxKm;
        }));
    }
}
