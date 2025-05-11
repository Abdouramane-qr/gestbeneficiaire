<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\OfflineStorageService;
use App\Services\CollecteSyncService;

class OfflineStorageServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Enregistrer le service OfflineStorage comme singleton
        $this->app->singleton(OfflineStorageService::class, function ($app) {
            return new OfflineStorageService();
        });

        // Enregistrer le service CollecteSync comme singleton
        $this->app->singleton(CollecteSyncService::class, function ($app) {
            return new CollecteSyncService(
                $app->make(OfflineStorageService::class)
            );
        });
    }

    public function boot()
    {
        //
    }
}
