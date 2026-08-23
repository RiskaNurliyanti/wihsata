<?php

namespace App\Policies;

use App\Models\Trip;
use App\Models\User;

class TripPolicy
{
    /** $user nullable karena trip publik (is_public=true) bisa dilihat tanpa login. */
    public function view(?User $user, Trip $trip): bool
    {
        return $trip->is_public || $user?->id === $trip->user_id || ($user?->isAdmin() ?? false);
    }

    public function update(User $user, Trip $trip): bool
    {
        return $user->id === $trip->user_id || $user->isAdmin();
    }

    public function delete(User $user, Trip $trip): bool
    {
        return $user->id === $trip->user_id || $user->isAdmin();
    }
}
