<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class ProvidersServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $providers = config('app.providers');
        if (is_array($providers)) {
            foreach ($providers as $provider) {
                if (class_exists($provider)) {
                    $this->app->register($provider);
                }
            }
        }
    }

    public function boot(): void
    {
        //
    }
}
