<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'canRegister' => Route::has('register'),
            'status' => session('status'),
        ]);
    }

    public function createCustomer(): Response
    {
        return Inertia::render('Customer/Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'canRegister' => Route::has('customer.register'),
            'status' => session('status'),
        ]);
    }

    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $request->session()->regenerate();

        $user = $request->user();

        if ($this->isAdmin($user) && Route::has('admin.dashboard')) {
            return redirect()->intended(route('admin.dashboard', absolute: false));
        }

        // A previous admin visit may have stored an admin URL in the session.
        // Customer accounts must always enter the customer area safely.
        $intended = $request->session()->pull('url.intended');

        if (is_string($intended) && str_contains($intended, '/account')) {
            return redirect()->to($intended);
        }

        return redirect()->route('customer.dashboard');
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home');
    }

    private function isAdmin(object $user): bool
    {
        if (method_exists($user, 'hasAnyRole')) {
            return $user->hasAnyRole([
                'Super Admin',
                'Admin',
                'Manager',
                'Staff',
            ]);
        }

        return method_exists($user, 'can') && $user->can('dashboard.view');
    }
}
