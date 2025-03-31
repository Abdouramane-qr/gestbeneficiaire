<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Collect;
use Illuminate\Auth\Access\Response;

class CollectPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view collects');
    }

    public function view(User $user, Collect $collect): bool
    {
        return $user->entreprise_id === $collect->entreprise_id;
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create collects');
    }

    public function update(User $user, Collect $collect): bool
    {
        return $user->entreprise_id === $collect->entreprise_id &&
               $user->hasPermissionTo('edit collects');
    }

    public function delete(User $user, Collect $collect): bool
    {
        return $user->entreprise_id === $collect->entreprise_id &&
               $user->hasPermissionTo('delete collects');
    }
}
