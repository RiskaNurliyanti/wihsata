<?php

namespace App\Enums;

enum TripStatus: string
{
    case Draft = 'draft';
    case Upcoming = 'upcoming';
    case Completed = 'completed';
    case Archived = 'archived';
}
