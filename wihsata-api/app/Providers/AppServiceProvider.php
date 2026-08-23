<?php

namespace App\Providers;

use App\Models\Article;
use App\Models\Trip;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Gate ini dipakai di controller lain (mis. Gate::authorize('manage-roles'))
        // sebagai lapisan otorisasi tambahan selain middleware 'role:'.
        Gate::define('manage-roles', fn (User $user) => $user->isSuperAdmin());
        Gate::define('access-admin-panel', fn (User $user) => $user->isAdmin());

        Gate::policy(Trip::class, \App\Policies\TripPolicy::class);
        Gate::policy(Article::class, \App\Policies\ArticlePolicy::class);
    }
}
