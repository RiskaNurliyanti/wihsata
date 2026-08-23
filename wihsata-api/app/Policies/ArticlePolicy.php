<?php

namespace App\Policies;

use App\Models\Article;
use App\Models\User;

class ArticlePolicy
{
    /** $user nullable karena endpoint GET artikel bersifat publik (tamu boleh baca yang published). */
    public function view(?User $user, Article $article): bool
    {
        return $article->is_published || $user?->id === $article->author_id || ($user?->isAdmin() ?? false);
    }

    public function update(User $user, Article $article): bool
    {
        return $user->id === $article->author_id || $user->isAdmin();
    }

    public function delete(User $user, Article $article): bool
    {
        return $user->id === $article->author_id || $user->isAdmin();
    }
}
