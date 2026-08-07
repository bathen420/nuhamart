<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CrmTimelineEntry;
use App\Models\Customer;
use App\Models\CustomerAddress;
use App\Models\CustomerCrmProfile;
use App\Models\LoyaltyTransaction;
use App\Models\Order;
use App\Models\Sale;
use App\Models\User;
use App\Models\WalletTransaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CrmController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()->can('crm.view') || $request->user()->can('customers.view'), 403);

        $customerBase = Customer::query();
        $completedSales = Sale::query()->where('sale_status', 'completed');

        $totalCustomers = (clone $customerBase)->count();
        $newThisMonth = (clone $customerBase)
            ->where('created_at', '>=', now()->startOfMonth())
            ->count();
        $activeCustomers = (clone $customerBase)->where('status', true)->count();
        $returningCustomers = (clone $customerBase)->has('sales', '>=', 2)->count();

        $lifetimeRevenue = (float) (clone $completedSales)->sum('total');
        $totalCompletedSales = (clone $completedSales)->count();
        $averageOrderValue = $totalCompletedSales > 0
            ? $lifetimeRevenue / $totalCompletedSales
            : 0;

        $repeatRate = $totalCustomers > 0
            ? round(($returningCustomers / $totalCustomers) * 100, 1)
            : 0;

        $profiles = CustomerCrmProfile::query();

        $walletBalance = (float) (clone $profiles)->sum('wallet_balance');
        $pointsBalance = (int) (clone $profiles)->sum('points_balance');

        $topCustomers = Customer::query()
            ->with(['crmProfile.loyaltyTier'])
            ->withCount('sales')
            ->withSum(
                ['sales as lifetime_spend' => fn ($query) => $query->where('sale_status', 'completed')],
                'total'
            )
            ->orderByDesc('lifetime_spend')
            ->limit(8)
            ->get();

        $recentCustomers = Customer::query()
            ->with(['crmProfile.loyaltyTier'])
            ->latest('id')
            ->limit(8)
            ->get();

        $recentActivity = CrmTimelineEntry::query()
            ->with(['customer:id,name,customer_code', 'user:id,name'])
            ->latest('id')
            ->limit(12)
            ->get();

        $monthly = collect(range(5, 0))
            ->map(function ($monthsAgo) {
                $month = now()->subMonths($monthsAgo);
                $start = $month->copy()->startOfMonth();
                $end = $month->copy()->endOfMonth();

                return [
                    'label' => $month->format('M'),
                    'customers' => Customer::query()
                        ->whereBetween('created_at', [$start, $end])
                        ->count(),
                    'revenue' => (float) Sale::query()
                        ->where('sale_status', 'completed')
                        ->whereBetween('created_at', [$start, $end])
                        ->sum('total'),
                    'orders' => Order::query()
                        ->whereBetween('created_at', [$start, $end])
                        ->count(),
                ];
            })
            ->values();

        $segments = [
            [
                'label' => 'New',
                'value' => $newThisMonth,
            ],
            [
                'label' => 'Returning',
                'value' => $returningCustomers,
            ],
            [
                'label' => 'With Due',
                'value' => (clone $customerBase)->where('current_balance', '>', 0)->count(),
            ],
            [
                'label' => 'Inactive',
                'value' => (clone $customerBase)->where('status', false)->count(),
            ],
        ];

        return Inertia::render('Admin/CRM/Index', [
            'summary' => [
                'total_customers' => $totalCustomers,
                'new_this_month' => $newThisMonth,
                'active_customers' => $activeCustomers,
                'returning_customers' => $returningCustomers,
                'repeat_rate' => $repeatRate,
                'lifetime_revenue' => $lifetimeRevenue,
                'average_order_value' => $averageOrderValue,
                'wallet_balance' => $walletBalance,
                'points_balance' => $pointsBalance,
                'outstanding_due' => (float) (clone $customerBase)->sum('current_balance'),
            ],
            'monthly' => $monthly,
            'segments' => $segments,
            'topCustomers' => $topCustomers,
            'recentCustomers' => $recentCustomers,
            'recentActivity' => $recentActivity,
        ]);
    }

    public function show(Request $request, Customer $customer): Response
    {
        abort_unless($request->user()->can('customers.view'), 403);

        $customer->load([
            'crmProfile.loyaltyTier',
            'sales' => fn ($query) => $query->latest()->limit(10),
            'orders' => fn ($query) => $query->latest()->limit(10),
            'loyaltyTransactions' => fn ($query) => $query->with('user')->latest()->limit(12),
            'walletTransactions' => fn ($query) => $query->with('user')->latest()->limit(12),
            'crmTimeline' => fn ($query) => $query->with('user')->latest()->limit(20),
        ]);

        $profile = $this->ensureProfile($customer);
        $addresses = $this->resolveCustomerAddresses($customer);

        $completedSales = $customer->sales->where('sale_status', 'completed');
        $lifetimeSpend = (float) $completedSales->sum('total');
        $completedOrders = $customer->orders->where('status', 'delivered')->count();

        $salesCount = $customer->sales->count();
        $ordersCount = $customer->orders->count();
        $transactionCount = $salesCount + $ordersCount;

        $lastSaleAt = $customer->sales->max('created_at');
        $lastOrderAt = $customer->orders->max('created_at');
        $lastPurchaseAt = collect([$lastSaleAt, $lastOrderAt])
            ->filter()
            ->map(fn ($value) => \Illuminate\Support\Carbon::parse($value))
            ->sortDesc()
            ->first();

        $customerAgeMonths = max(
            1,
            (int) ceil($customer->created_at->diffInDays(now()) / 30)
        );

        $purchaseFrequency = round($transactionCount / $customerAgeMonths, 2);
        $daysSinceLastPurchase = $lastPurchaseAt
            ? $lastPurchaseAt->diffInDays(now())
            : null;

        $customerStage = match (true) {
            $transactionCount === 0 => 'Prospect',
            $transactionCount === 1 => 'New',
            $transactionCount >= 5 || $lifetimeSpend >= 50000 => 'Loyal',
            default => 'Returning',
        };

        $activity = collect()
            ->merge($customer->crmTimeline->map(fn ($entry) => [
                'id' => 'crm-' . $entry->id,
                'type' => $entry->type,
                'title' => $entry->title,
                'description' => $entry->description,
                'amount' => null,
                'status' => null,
                'created_at' => $entry->created_at?->toIso8601String(),
                'actor' => $entry->user?->name ?? 'System',
            ]))
            ->merge($customer->sales->map(fn ($sale) => [
                'id' => 'sale-' . $sale->id,
                'type' => 'sale',
                'title' => 'Sale ' . ($sale->sale_number ?? ('#' . $sale->id)),
                'description' => 'POS/Admin sale recorded',
                'amount' => (float) $sale->total,
                'status' => $sale->sale_status,
                'created_at' => $sale->created_at?->toIso8601String(),
                'actor' => 'Sales',
            ]))
            ->merge($customer->orders->map(fn ($order) => [
                'id' => 'order-' . $order->id,
                'type' => 'order',
                'title' => 'Order ' . ($order->order_no ?? ('#' . $order->id)),
                'description' => 'Storefront order activity',
                'amount' => (float) $order->total,
                'status' => $order->status,
                'created_at' => $order->created_at?->toIso8601String(),
                'actor' => 'Storefront',
            ]))
            ->merge($customer->walletTransactions->map(fn ($transaction) => [
                'id' => 'wallet-' . $transaction->id,
                'type' => 'wallet',
                'title' => $transaction->type === 'credit' ? 'Wallet credited' : 'Wallet debited',
                'description' => $transaction->note,
                'amount' => (float) $transaction->amount,
                'status' => $transaction->type,
                'created_at' => $transaction->created_at?->toIso8601String(),
                'actor' => $transaction->user?->name ?? 'System',
            ]))
            ->merge($customer->loyaltyTransactions->map(fn ($transaction) => [
                'id' => 'loyalty-' . $transaction->id,
                'type' => 'loyalty',
                'title' => $transaction->type === 'credit' ? 'Loyalty points earned' : 'Loyalty points redeemed',
                'description' => $transaction->note,
                'amount' => (int) $transaction->points,
                'status' => $transaction->type,
                'created_at' => $transaction->created_at?->toIso8601String(),
                'actor' => $transaction->user?->name ?? 'System',
            ]))
            ->sortByDesc('created_at')
            ->take(30)
            ->values();

        return Inertia::render('Admin/CRM/Show', [
            'customer' => [
                'id' => $customer->id,
                'customer_code' => $customer->customer_code,
                'name' => $customer->name,
                'phone' => $customer->phone,
                'email' => $customer->email,
                'address' => $customer->address,
                'opening_balance' => (float) $customer->opening_balance,
                'current_balance' => (float) $customer->current_balance,
                'status' => (bool) $customer->status,
                'notes' => $customer->notes,
                'created_at' => $customer->created_at?->toIso8601String(),
                'profile' => [
                    'membership_number' => $profile->membership_number,
                    'points_balance' => (int) $profile->points_balance,
                    'lifetime_points' => (int) $profile->lifetime_points,
                    'wallet_balance' => (float) $profile->wallet_balance,
                    'credit_limit' => (float) $profile->credit_limit,
                    'birthday' => optional($profile->birthday)->toDateString(),
                    'anniversary' => optional($profile->anniversary)->toDateString(),
                    'last_purchase_at' => optional($profile->last_purchase_at)->toIso8601String(),
                    'tier' => $profile->loyaltyTier?->name,
                ],
                'statistics' => [
                    'total_sales' => $salesCount,
                    'completed_sales' => $completedSales->count(),
                    'total_orders' => $ordersCount,
                    'completed_orders' => $completedOrders,
                    'lifetime_spend' => $lifetimeSpend,
                    'average_order_value' => $completedSales->count() > 0
                        ? $lifetimeSpend / $completedSales->count()
                        : 0,
                    'total_transactions' => $transactionCount,
                    'purchase_frequency' => $purchaseFrequency,
                    'days_since_last_purchase' => $daysSinceLastPurchase,
                    'last_purchase_at' => $lastPurchaseAt?->toIso8601String(),
                    'customer_stage' => $customerStage,
                ],
                'sales' => $customer->sales->values(),
                'orders' => $customer->orders->values(),
                'addresses' => $addresses,
                'loyalty_transactions' => $customer->loyaltyTransactions,
                'wallet_transactions' => $customer->walletTransactions,
                'timeline' => $customer->crmTimeline,
                'activity' => $activity,
            ],
        ]);
    }

    public function points(Request $request, Customer $customer): RedirectResponse
    {
        abort_unless($request->user()->can('customers.loyalty.manage'), 403);

        $validated = $request->validate([
            'points' => ['required', 'integer', 'not_in:0', 'between:-1000000,1000000'],
            'note' => ['nullable', 'string', 'max:1000'],
        ]);

        DB::transaction(function () use ($request, $customer, $validated) {
            $profile = $this->ensureProfile($customer);
            $newBalance = max(0, $profile->points_balance + $validated['points']);
            $effectivePoints = $newBalance - $profile->points_balance;

            $profile->forceFill([
                'points_balance' => $newBalance,
                'lifetime_points' => $effectivePoints > 0
                    ? $profile->lifetime_points + $effectivePoints
                    : $profile->lifetime_points,
            ])->save();

            LoyaltyTransaction::create([
                'customer_id' => $customer->id,
                'user_id' => $request->user()->id,
                'type' => $effectivePoints >= 0 ? 'credit' : 'debit',
                'points' => $effectivePoints,
                'balance_after' => $newBalance,
                'reference' => 'ADMIN-' . now()->format('YmdHis'),
                'note' => $validated['note'] ?? null,
            ]);

            $this->timeline(
                $customer,
                $request,
                'loyalty',
                $effectivePoints >= 0 ? 'Loyalty points awarded' : 'Loyalty points adjusted',
                "{$effectivePoints} points. Balance: {$newBalance}."
            );
        });

        return back()->with('success', 'Loyalty points updated successfully.');
    }

    public function wallet(Request $request, Customer $customer): RedirectResponse
    {
        abort_unless($request->user()->can('customers.wallet.manage'), 403);

        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'not_in:0', 'between:-10000000,10000000'],
            'note' => ['nullable', 'string', 'max:1000'],
        ]);

        DB::transaction(function () use ($request, $customer, $validated) {
            $profile = $this->ensureProfile($customer);
            $newBalance = max(0, (float) $profile->wallet_balance + (float) $validated['amount']);
            $effectiveAmount = $newBalance - (float) $profile->wallet_balance;

            $profile->forceFill(['wallet_balance' => $newBalance])->save();

            WalletTransaction::create([
                'customer_id' => $customer->id,
                'user_id' => $request->user()->id,
                'type' => $effectiveAmount >= 0 ? 'credit' : 'debit',
                'amount' => $effectiveAmount,
                'balance_after' => $newBalance,
                'reference' => 'ADMIN-' . now()->format('YmdHis'),
                'note' => $validated['note'] ?? null,
            ]);

            $this->timeline(
                $customer,
                $request,
                'wallet',
                $effectiveAmount >= 0 ? 'Wallet credited' : 'Wallet debited',
                "Amount: {$effectiveAmount}. Balance: {$newBalance}."
            );
        });

        return back()->with('success', 'Wallet balance updated successfully.');
    }

    public function note(Request $request, Customer $customer): RedirectResponse
    {
        abort_unless($request->user()->can('customers.notes.manage'), 403);

        $validated = $request->validate([
            'note' => ['required', 'string', 'max:2000'],
        ]);

        $this->timeline(
            $customer,
            $request,
            'note',
            'Internal note added',
            $validated['note']
        );

        return back()->with('success', 'Internal note added successfully.');
    }

    private function resolveCustomerAddresses(Customer $customer)
    {
        $user = User::query()
            ->when(
                filled($customer->email),
                fn ($query) => $query->where('email', $customer->email)
            )
            ->when(
                blank($customer->email) && filled($customer->phone),
                fn ($query) => $query->where('phone', $customer->phone)
            )
            ->first();

        if (! $user && filled($customer->phone)) {
            $user = User::query()
                ->where('phone', $customer->phone)
                ->first();
        }

        if (! $user) {
            return collect();
        }

        return CustomerAddress::query()
            ->where('user_id', $user->id)
            ->orderByDesc('is_default')
            ->latest('id')
            ->get();
    }

    private function ensureProfile(Customer $customer): CustomerCrmProfile
    {
        return CustomerCrmProfile::firstOrCreate(
            ['customer_id' => $customer->id],
            [
                'membership_number' => 'CRM-' . str_pad((string) $customer->id, 7, '0', STR_PAD_LEFT) . '-' . Str::upper(Str::random(4)),
            ]
        );
    }

    private function timeline(
        Customer $customer,
        Request $request,
        string $type,
        string $title,
        ?string $description = null
    ): void {
        CrmTimelineEntry::create([
            'customer_id' => $customer->id,
            'user_id' => $request->user()->id,
            'type' => $type,
            'title' => $title,
            'description' => $description,
        ]);
    }
}
