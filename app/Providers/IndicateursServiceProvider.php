<?php

namespace App\Providers;

use App\Services\IndicateursAnalyseService;
use Illuminate\Support\ServiceProvider;

class IndicateursServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton(IndicateursAnalyseService::class, function ($app) {
            return new IndicateursAnalyseService();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
