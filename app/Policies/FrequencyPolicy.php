<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Frequency;
use Illuminate\Auth\Access\Response;

class FrequencyPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('view frequencies');
    }

    public function create(User $user): bool
    {
        return $user->can('create frequencies');
    }

    public function update(User $user, Frequency $frequency): bool
    {
        return $user->can('edit frequencies');
    }

    public function delete(User $user, Frequency $frequency): bool
    {
        return $frequency->is_custom && $user->can('delete frequencies');
    }
}
