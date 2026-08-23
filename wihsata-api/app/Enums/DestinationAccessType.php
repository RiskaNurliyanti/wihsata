<?php

namespace App\Enums;

enum DestinationAccessType: string
{
    case Darat = 'darat';
    case Kapal = 'kapal';
    case Kombinasi = 'kombinasi';

    public function requiresBoat(): bool
    {
        return $this === self::Kapal || $this === self::Kombinasi;
    }
}
