<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">

    <title>Invoice {{ $order->order_no }}</title>

    <style>
        @page {
            margin: 18px 24px;
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 0;
            color: #1f2937;
            font-family: DejaVu Sans, sans-serif;
            font-size: 11px;
            line-height: 1.45;
        }

        .page {
            width: 100%;
        }

        .header-table,
        .info-table,
        .summary-layout,
        .footer-table {
            width: 100%;
            border-collapse: collapse;
        }

        .header-table td,
        .info-table td,
        .summary-layout td,
        .footer-table td {
            vertical-align: top;
        }

        .header {
            padding-bottom: 14px;
            border-bottom: 3px solid #0f766e;
        }

        .brand-name {
            margin: 0;
            color: #0f766e;
            font-size: 25px;
            font-weight: 700;
            line-height: 1.15;
        }

        .brand-subtitle {
            margin-top: 4px;
            color: #64748b;
            font-size: 10px;
        }

        .company-details {
            margin-top: 10px;
            color: #475569;
            font-size: 10px;
            line-height: 1.6;
        }

        .invoice-title {
            margin: 0;
            color: #111827;
            font-size: 28px;
            font-weight: 700;
            text-align: right;
        }

        .invoice-meta {
            margin-top: 9px;
            color: #475569;
            text-align: right;
            line-height: 1.7;
        }

        .invoice-meta strong {
            color: #111827;
        }

        .section {
            margin-top: 14px;
        }

        .info-card {
            min-height: 115px;
            padding: 12px;
            border: 1px solid #dbe3ea;
            border-radius: 5px;
            background: #f8fafc;
        }

        .section-title {
            margin: 0 0 9px;
            padding-bottom: 5px;
            border-bottom: 1px solid #dbe3ea;
            color: #0f766e;
            font-size: 13px;
            font-weight: 700;
        }

        .detail-row {
            margin-bottom: 5px;
        }

        .detail-label {
            display: inline-block;
            width: 92px;
            color: #64748b;
            font-weight: 700;
        }

        .detail-value {
            color: #111827;
        }

        .status {
            display: inline-block;
            padding: 2px 7px;
            border-radius: 10px;
            background: #e2e8f0;
            font-size: 9px;
            font-weight: 700;
            text-transform: uppercase;
        }

        .status-paid,
        .status-delivered {
            color: #166534;
            background: #dcfce7;
        }

        .status-pending {
            color: #92400e;
            background: #fef3c7;
        }

        .status-failed,
        .status-cancelled {
            color: #991b1b;
            background: #fee2e2;
        }

        .items-table {
            width: 100%;
            margin-top: 14px;
            border-collapse: collapse;
        }

        .items-table thead {
            display: table-header-group;
        }

        .items-table tr {
            page-break-inside: avoid;
        }

        .items-table th {
            padding: 8px 7px;
            border: 1px solid #0f766e;
            color: #ffffff;
            background: #0f766e;
            font-size: 10px;
            font-weight: 700;
        }

        .items-table td {
            padding: 8px 7px;
            border: 1px solid #dbe3ea;
            color: #334155;
            font-size: 10px;
        }

        .text-center {
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        .product-name {
            color: #111827;
            font-weight: 700;
        }

        .product-meta {
            margin-top: 2px;
            color: #64748b;
            font-size: 9px;
        }

        .summary-layout {
            margin-top: 12px;
        }

        .notes-box {
            padding: 10px;
            border: 1px solid #dbe3ea;
            border-radius: 5px;
            background: #f8fafc;
        }

        .notes-title {
            margin-bottom: 5px;
            color: #0f766e;
            font-weight: 700;
        }

        .summary-table {
            width: 100%;
            border-collapse: collapse;
        }

        .summary-table td {
            padding: 6px 8px;
            border-bottom: 1px solid #e5e7eb;
        }

        .summary-label {
            color: #64748b;
        }

        .summary-value {
            color: #111827;
            font-weight: 700;
            text-align: right;
        }

        .grand-total td {
            padding-top: 9px;
            padding-bottom: 9px;
            border-bottom: none;
            color: #ffffff;
            background: #0f766e;
            font-size: 13px;
            font-weight: 700;
        }

        .footer {
            margin-top: 22px;
            padding-top: 12px;
            border-top: 1px solid #dbe3ea;
            color: #64748b;
            font-size: 9px;
        }

        .signature {
            padding-top: 28px;
            text-align: right;
        }

        .signature-line {
            display: inline-block;
            width: 160px;
            padding-top: 5px;
            border-top: 1px solid #111827;
            color: #111827;
            text-align: center;
            font-weight: 700;
        }

        .thank-you {
            margin-top: 14px;
            color: #0f766e;
            font-size: 13px;
            font-weight: 700;
            text-align: center;
        }

        .small-text {
            color: #64748b;
            font-size: 9px;
        }
    </style>
</head>

<body>
@php
    $businessSetting = \App\Models\BusinessSetting::current();

    $companyName = $businessSetting?->company_name ?: 'Nuha Mart BD';
    $companyAddress = $businessSetting?->address ?: 'Dhaka, Bangladesh';
    $companyEmail = $businessSetting?->email ?: 'support@nuhamartbd.com';
    $companyPhone = $businessSetting?->phone ?: '+880 1700-000000';
    $currency = $businessSetting?->currency_symbol ?: '৳';

    $invoiceDate = $order->ordered_at ?? $order->created_at;

    $shippingAddress = collect([
        $order->address,
        $order->area,
        $order->district,
        $order->division,
    ])->filter()->implode(', ');

    $courierConsignment = $order->courierConsignments?->first();

    $paymentStatus = strtolower((string) $order->payment_status);
    $orderStatus = strtolower((string) $order->status);

    $subtotal = (float) ($order->subtotal ?? 0);
    $discount = (float) ($order->discount ?? 0);
    $shippingCharge = (float) ($order->shipping_charge ?? 0);
    $grandTotal = (float) ($order->total ?? 0);
@endphp

<div class="page">

    {{-- Header --}}
    <div class="header">
        <table class="header-table">
            <tr>
                <td style="width: 58%;">
                    <h1 class="brand-name">{{ $companyName }}</h1>

                    <div class="brand-subtitle">
                        Books, E-Books, Stationery & Lifestyle Products
                    </div>

                    <div class="company-details">
                        {{ $companyAddress }}<br>
                        Email: {{ $companyEmail }}<br>
                        Phone: {{ $companyPhone }}
                    </div>
                </td>

                <td style="width: 42%;">
                    <h2 class="invoice-title">INVOICE</h2>

                    <div class="invoice-meta">
                        <strong>Invoice No:</strong>
                        {{ $order->order_no }}<br>

                        <strong>Date:</strong>
                        {{ optional($invoiceDate)->format('d M Y, h:i A') }}<br>

                        <strong>Order ID:</strong>
                        #{{ $order->id }}
                    </div>
                </td>
            </tr>
        </table>
    </div>

    {{-- Customer and payment information --}}
    <div class="section">
        <table class="info-table">
            <tr>
                <td style="width: 49%; padding-right: 6px;">
                    <div class="info-card">
                        <div class="section-title">Customer Information</div>

                        <div class="detail-row">
                            <span class="detail-label">Name</span>
                            <span class="detail-value">
                                {{ $order->customer_name ?: '-' }}
                            </span>
                        </div>

                        <div class="detail-row">
                            <span class="detail-label">Phone</span>
                            <span class="detail-value">
                                {{ $order->customer_phone ?: '-' }}
                            </span>
                        </div>

                        <div class="detail-row">
                            <span class="detail-label">Email</span>
                            <span class="detail-value">
                                {{ $order->customer_email ?: '-' }}
                            </span>
                        </div>

                        <div class="detail-row">
                            <span class="detail-label">Address</span>
                            <span class="detail-value">
                                {{ $shippingAddress ?: 'Store Pickup / Not provided' }}
                            </span>
                        </div>
                    </div>
                </td>

                <td style="width: 49%; padding-left: 6px;">
                    <div class="info-card">
                        <div class="section-title">Payment & Delivery</div>

                        <div class="detail-row">
                            <span class="detail-label">Payment</span>
                            <span class="detail-value">
                                {{ ucwords(str_replace('_', ' ', $order->payment_method ?: '-')) }}
                            </span>
                        </div>

                        <div class="detail-row">
                            <span class="detail-label">Pay Status</span>
                            <span class="status status-{{ $paymentStatus }}">
                                {{ ucfirst($paymentStatus ?: 'pending') }}
                            </span>
                        </div>

                        <div class="detail-row">
                            <span class="detail-label">Order Status</span>
                            <span class="status status-{{ $orderStatus }}">
                                {{ ucwords(str_replace('_', ' ', $orderStatus ?: 'pending')) }}
                            </span>
                        </div>

                        <div class="detail-row">
                            <span class="detail-label">Courier</span>
                            <span class="detail-value">
                                {{ $order->courier_name
                                    ?: $courierConsignment?->provider
                                    ?: 'Not assigned' }}
                            </span>
                        </div>

                        <div class="detail-row">
                            <span class="detail-label">Tracking</span>
                            <span class="detail-value">
                                {{ $order->tracking_number
                                    ?: $courierConsignment?->tracking_code
                                    ?: '-' }}
                            </span>
                        </div>
                    </div>
                </td>
            </tr>
        </table>
    </div>

    {{-- Ordered items --}}
    <table class="items-table">
        <thead>
            <tr>
                <th style="width: 6%;">#</th>
                <th style="width: 42%;">Product</th>
                <th style="width: 12%;">Qty</th>
                <th style="width: 20%;">Unit Price</th>
                <th style="width: 20%;">Total</th>
            </tr>
        </thead>

        <tbody>
            @forelse($order->items as $item)
                @php
                    $productName = $item->product_name
                        ?: $item->product?->name
                        ?: 'Product';

                    $sku = $item->sku
                        ?: $item->product?->sku;

                    $unitPrice = (float) ($item->unit_price ?? 0);
                    $lineTotal = (float) ($item->subtotal ?? 0);
                @endphp

                <tr>
                    <td class="text-center">
                        {{ $loop->iteration }}
                    </td>

                    <td>
                        <div class="product-name">
                            {{ $productName }}
                        </div>

                        @if($sku)
                            <div class="product-meta">
                                SKU: {{ $sku }}
                            </div>
                        @endif
                    </td>

                    <td class="text-center">
                        {{ $item->quantity }}
                    </td>

                    <td class="text-right">
                        {{ $currency }} {{ number_format($unitPrice, 2) }}
                    </td>

                    <td class="text-right">
                        {{ $currency }} {{ number_format($lineTotal, 2) }}
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="5" class="text-center">
                        No products found for this order.
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>

    {{-- Notes and totals --}}
    <table class="summary-layout">
        <tr>
            <td style="width: 55%; padding-right: 18px;">
                <div class="notes-box">
                    <div class="notes-title">Order Notes</div>

                    <div>
                        {{ $order->note ?: 'No additional notes.' }}
                    </div>

                    @if($order->coupon_code)
                        <div style="margin-top: 8px;">
                            <strong>Coupon:</strong>
                            {{ $order->coupon_code }}
                        </div>
                    @endif

                    @if($order->admin_note)
                        <div style="margin-top: 8px;">
                            <strong>Internal reference:</strong>
                            {{ $order->admin_note }}
                        </div>
                    @endif
                </div>
            </td>

            <td style="width: 45%;">
                <table class="summary-table">
                    <tr>
                        <td class="summary-label">Subtotal</td>
                        <td class="summary-value">
                            {{ $currency }} {{ number_format($subtotal, 2) }}
                        </td>
                    </tr>

                    <tr>
                        <td class="summary-label">Discount</td>
                        <td class="summary-value">
                            - {{ $currency }} {{ number_format($discount, 2) }}
                        </td>
                    </tr>

                    <tr>
                        <td class="summary-label">Shipping</td>
                        <td class="summary-value">
                            {{ $currency }} {{ number_format($shippingCharge, 2) }}
                        </td>
                    </tr>

                    <tr class="grand-total">
                        <td>Grand Total</td>
                        <td class="text-right">
                            {{ $currency }} {{ number_format($grandTotal, 2) }}
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    {{-- Signature --}}
    <div class="signature">
        <div class="signature-line">
            Authorized Signature
        </div>
    </div>

    {{-- Footer --}}
    <div class="footer">
        <table class="footer-table">
            <tr>
                <td style="width: 60%;">
                    This is a computer-generated invoice.
                    No physical signature is required unless requested.
                </td>

                <td style="width: 40%; text-align: right;">
                    Generated by Nuha Mart BD
                </td>
            </tr>
        </table>

        <div class="thank-you">
            Thank you for shopping with {{ $companyName }}.
        </div>

        <div class="small-text" style="margin-top: 5px; text-align: center;">
            For support, contact {{ $companyPhone }} or {{ $companyEmail }}
        </div>
    </div>

</div>
</body>
</html>