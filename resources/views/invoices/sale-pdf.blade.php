<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Invoice {{ $sale->sale_number }}</title>
    <style>
        @page { margin: 28px 34px; }
        body { font-family: DejaVu Sans, sans-serif; color: #0f172a; font-size: 11px; }
        .header { border-bottom: 3px solid #1d4ed8; padding-bottom: 16px; margin-bottom: 18px; }
        .brand { color: #1d4ed8; font-size: 25px; font-weight: bold; }
        .muted { color: #64748b; }
        .right { text-align: right; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #1d4ed8; color: #fff; padding: 9px; text-align: left; }
        td { padding: 9px; border-bottom: 1px solid #e2e8f0; }
        .totals { width: 42%; margin-left: auto; margin-top: 18px; background: #f8fafc; }
        .totals td { border: 0; padding: 6px 9px; }
        .strong { font-size: 14px; font-weight: bold; }
        .footer { margin-top: 28px; padding-top: 12px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b; }
    </style>
</head>
<body>
    <table class="header"><tr><td style="border:0; padding:0;">
        @if(!empty($invoiceSettings['logo_path']) && file_exists($invoiceSettings['logo_path']))
            <img src="{{ $invoiceSettings['logo_path'] }}" style="max-height:55px;max-width:180px;margin-bottom:5px;">
        @endif
        <div class="brand">{{ $invoiceSettings['company_name'] ?: 'Nuha Mart BD' }}</div>
        <div class="muted">{{ $invoiceSettings['company_tagline'] ?: 'Inventory & POS System' }}</div>
        <div class="muted">{{ collect([$invoiceSettings['address'], $invoiceSettings['phone'], $invoiceSettings['email'], $invoiceSettings['website']])->filter()->implode(' · ') }}</div>
    </td><td style="border:0; padding:0;" class="right">
        <div style="font-size:18px;font-weight:bold;">SALES INVOICE</div>
        <div><b>{{ $sale->sale_number }}</b></div>
        <div class="muted">{{ optional($sale->created_at)->format('d M Y, h:i A') }}</div>
    </td></tr></table>

    <table style="margin-bottom:18px;"><tr><td style="width:50%; border:0; padding-left:0;"><b>Bill To</b><br>{{ optional($sale->customer)->name ?: 'Walk-in Customer' }}<br>{{ optional($sale->customer)->phone }}<br>{{ optional($sale->customer)->email }}</td><td class="right" style="border:0; padding-right:0;"><b>Served By:</b> {{ optional($sale->user)->name ?: 'Administrator' }}<br><b>Payment:</b> {{ ucfirst(str_replace('_', ' ', $sale->payment_method ?: 'cash')) }}<br><b>Status:</b> {{ $sale->sale_status ?: 'Completed' }}</td></tr></table>

    <table><thead><tr><th>#</th><th>Product</th><th class="right">Qty</th><th class="right">Price</th><th class="right">Amount</th></tr></thead><tbody>
    @forelse($sale->items as $index => $item)
        <tr><td>{{ $index + 1 }}</td><td>{{ optional($item->product)->name ?: 'Product #'.$item->product_id }}</td><td class="right">{{ $item->quantity }}</td><td class="right">{{ $invoiceSettings['currency_symbol'] }}{{ number_format((float)$item->price, 2) }}</td><td class="right"><b>{{ $invoiceSettings['currency_symbol'] }}{{ number_format((float)$item->subtotal, 2) }}</b></td></tr>
    @empty
        <tr><td colspan="5" style="text-align:center;">No sale items found.</td></tr>
    @endforelse
    </tbody></table>

    <table class="totals">
        <tr><td>Subtotal</td><td class="right">{{ $invoiceSettings['currency_symbol'] }}{{ number_format((float)$sale->subtotal, 2) }}</td></tr>
        <tr><td>Discount</td><td class="right">-{{ $invoiceSettings['currency_symbol'] }}{{ number_format((float)$sale->discount, 2) }}</td></tr>
        <tr><td>Tax</td><td class="right">{{ $invoiceSettings['currency_symbol'] }}{{ number_format((float)$sale->tax, 2) }}</td></tr>
        <tr><td>Shipping</td><td class="right">{{ $invoiceSettings['currency_symbol'] }}{{ number_format((float)$sale->shipping, 2) }}</td></tr>
        <tr class="strong"><td>Total</td><td class="right">{{ $invoiceSettings['currency_symbol'] }}{{ number_format((float)$sale->total, 2) }}</td></tr>
        <tr><td>Paid</td><td class="right">{{ $invoiceSettings['currency_symbol'] }}{{ number_format((float)$sale->paid_amount, 2) }}</td></tr>
        <tr><td><b>Due</b></td><td class="right"><b>{{ $invoiceSettings['currency_symbol'] }}{{ number_format((float)$sale->due_amount, 2) }}</b></td></tr>
    </table>

    @if((float)$sale->returned_total > 0)
        <p><b>Return summary:</b> Original {{ $invoiceSettings['currency_symbol'] }}{{ number_format((float)$sale->original_total, 2) }}, Returned {{ $invoiceSettings['currency_symbol'] }}{{ number_format((float)$sale->returned_total, 2) }}, Net {{ $invoiceSettings['currency_symbol'] }}{{ number_format((float)$sale->net_total, 2) }}.</p>
    @endif

    <div class="footer">{{ $invoiceSettings['invoice_footer'] ?: 'Thank you for your purchase.' }}<br><small>This invoice was generated electronically.</small></div>
</body>
</html>
