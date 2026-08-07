<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BusinessSetting;
use App\Models\Sale;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class InvoiceController extends Controller
{
    public function a4(Sale $sale): Response
    {
        return Inertia::render('Admin/Invoices/A4', $this->payload($sale));
    }

    public function thermal(Request $request, Sale $sale): Response
    {
        $size = (int) $request->integer('size', 80);

        if (! in_array($size, [58, 80], true)) {
            $size = 80;
        }

        return Inertia::render('Admin/Invoices/Thermal', [
            ...$this->payload($sale),
            'paperSize' => $size,
        ]);
    }

    public function pdf(Sale $sale): SymfonyResponse
    {
        $payload = $this->payload($sale);

        $pdf = Pdf::loadView('invoices.sale-pdf', $payload)
            ->setPaper('a4', 'portrait')
            ->setOption('isRemoteEnabled', true)
            ->setOption('defaultFont', 'DejaVu Sans');

        $filename = sprintf('%s-invoice.pdf', $sale->sale_number ?: $sale->id);

        return $pdf->download($filename);
    }

    private function payload(Sale $sale): array
    {
        $sale->load([
            'customer',
            'user:id,name,email',
            'items.product',
            'returns' => fn ($query) => $query
                ->where('status', 'completed')
                ->with('items.product')
                ->latest('id'),
        ]);

        $returnedTotal = round((float) $sale->returns->sum('subtotal'), 2);
        $netTotal = round((float) $sale->total, 2);
        $originalTotal = round($netTotal + $returnedTotal, 2);

        $sale->setAttribute('original_total', $originalTotal);
        $sale->setAttribute('returned_total', $returnedTotal);
        $sale->setAttribute('net_total', $netTotal);

        $settings = BusinessSetting::current();

        return [
            'sale' => $sale,
            'invoiceSettings' => [
                'company_name' => $settings->company_name,
                'company_tagline' => $settings->company_tagline,
                'logo' => $settings->logo,
                'logo_path' => $settings->localImagePath('invoice_logo'),
                'address' => $settings->address,
                'phone' => $settings->phone,
                'email' => $settings->support_email ?: $settings->email,
                'website' => $settings->website,
                'currency_code' => $settings->currency_code,
                'currency_symbol' => $settings->currency_symbol,
                'invoice_footer' => $settings->invoice_footer,
                'receipt_footer' => $settings->receipt_footer,
                'pos_logo' => $settings->assetUrl(
                    $settings->pos_logo ?: $settings->invoice_logo ?: $settings->logo
                ),
            ],
            'generatedAt' => now()->toIso8601String(),
        ];
    }
}
