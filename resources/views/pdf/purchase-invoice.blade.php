<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Purchase Invoice - {{ $purchase->purchase_number }}</title>

    <style>
        @page {
            margin: 18px 20px;
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 0;
            font-family: DejaVu Sans, sans-serif;
            font-size: 11px;
            line-height: 1.45;
            color: #1f2937;
            background: #ffffff;
        }

        .invoice-wrapper {
            width: 100%;
        }

        .header-table,
        .info-table,
        .items-table,
        .summary-table,
        .signature-table,
        .footer-table {
            width: 100%;
            border-collapse: collapse;
        }

        .header-table td {
            vertical-align: top;
        }

        .brand-name {
            margin: 0;
            font-size: 25px;
            font-weight: 700;
            color: #2563eb;
            letter-spacing: 0.3px;
        }

        .brand-subtitle {
            margin-top: 3px;
            font-size: 10px;
            color: #6b7280;
        }

        .company-details {
            margin-top: 11px;
            font-size: 10px;
            line-height: 1.65;
            color: #374151;
        }

        .invoice-title {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            text-align: right;
            color: #111827;
            letter-spacing: 0.5px;
        }

        .invoice-meta {
            margin-top: 12px;
            text-align: right;
            font-size: 10px;
            color: #374151;
        }

        .invoice-meta strong {
            color: #111827;
        }

        .blue-line {
            height: 3px;
            margin: 15px 0 14px;
            background: #2563eb;
        }

        .info-table {
            table-layout: fixed;
            margin-bottom: 14px;
        }

        .info-table td {
            width: 50%;
            vertical-align: top;
        }

        .info-left {
            padding-right: 7px;
        }

        .info-right {
            padding-left: 7px;
        }

        .info-box {
            min-height: 138px;
            padding: 12px 13px;
            border: 1px solid #d1d5db;
            background: #ffffff;
        }

        .section-title {
            margin: 0 0 9px;
            padding-bottom: 6px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 12px;
            font-weight: 700;
            color: #111827;
        }

        .detail-row {
            margin-bottom: 7px;
        }

        .detail-label {
            display: inline-block;
            width: 105px;
            font-weight: 700;
            color: #374151;
        }

        .detail-value {
            color: #374151;
        }

        .items-table {
            table-layout: fixed;
            margin-bottom: 12px;
        }

        .items-table th {
            padding: 9px 7px;
            border: 1px solid #2563eb;
            background: #2563eb;
            color: #ffffff;
            font-size: 10px;
            font-weight: 700;
            text-align: center;
        }

        .items-table td {
            padding: 8px 7px;
            border: 1px solid #d1d5db;
            color: #374151;
            vertical-align: middle;
        }

        .items-table .serial {
            width: 6%;
            text-align: center;
        }

        .items-table .product {
            width: 42%;
        }

        .items-table .quantity {
            width: 12%;
            text-align: center;
        }

        .items-table .price,
        .items-table .subtotal {
            width: 20%;
            text-align: right;
            white-space: nowrap;
        }

        .summary-wrapper {
            width: 100%;
            margin-bottom: 14px;
        }

        .summary-spacer {
            width: 58%;
            float: left;
        }

        .summary-box {
            width: 42%;
            float: right;
        }

        .summary-table td {
            padding: 8px 9px;
            border: 1px solid #d1d5db;
        }

        .summary-label {
            width: 45%;
            font-weight: 700;
            background: #f3f4f6;
            color: #374151;
        }

        .summary-value {
            width: 55%;
            text-align: right;
            white-space: nowrap;
        }

        .grand-total td {
            border-color: #2563eb;
            background: #2563eb;
            color: #ffffff;
            font-size: 12px;
            font-weight: 700;
        }

        .clearfix::after {
            display: block;
            clear: both;
            content: "";
        }

        .note-box {
            margin-top: 4px;
            padding: 11px 13px;
            border: 1px solid #d1d5db;
            background: #ffffff;
        }

        .note-title {
            margin-bottom: 5px;
            font-size: 11px;
            font-weight: 700;
            color: #111827;
        }

        .note-text {
            color: #4b5563;
        }

        .signature-table {
            margin-top: 42px;
        }

        .signature-table td {
            width: 50%;
            vertical-align: top;
        }

        .signature-left {
            padding-right: 55px;
        }

        .signature-right {
            padding-left: 55px;
        }

        .signature-line {
            border-top: 1px solid #374151;
            padding-top: 7px;
            text-align: center;
            font-size: 10px;
            color: #374151;
        }

        .footer {
            margin-top: 34px;
            padding-top: 8px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 9px;
            color: #6b7280;
        }

        .page-number {
            margin-top: 3px;
        }
    </style>
</head>

<body>
    <div class="invoice-wrapper">

        <table class="header-table">
            <tr>
                <td style="width: 55%;">
                    <h1 class="brand-name">NuhaMart</h1>
                    <div class="brand-subtitle">Inventory &amp; POS System</div>

                    <div class="company-details">
                        Dhaka, Bangladesh<br>
                        Email: support@nuhamart.com<br>
                        Phone: +8801700000000
                    </div>
                </td>

                <td style="width: 45%;">
                    <h2 class="invoice-title">PURCHASE</h2>

                    <div class="invoice-meta">
                        <strong>Purchase No:</strong><br>
                        {{ $purchase->purchase_number }}<br><br>

                        <strong>Purchase Date:</strong><br>
                        {{ optional($purchase->created_at)->format('d M Y') }}
                    </div>
                </td>
            </tr>
        </table>

        <div class="blue-line"></div>

        <table class="info-table">
            <tr>
                <td class="info-left">
                    <div class="info-box">
                        <div class="section-title">Purchase Information</div>

                        <div class="detail-row">
                            <span class="detail-label">Purchase Number:</span>
                            <span class="detail-value">
                                {{ $purchase->purchase_number }}
                            </span>
                        </div>

                        <div class="detail-row">
                            <span class="detail-label">Date:</span>
                            <span class="detail-value">
                                {{ optional($purchase->created_at)->format('d M Y, h:i A') }}
                            </span>
                        </div>

                        <div class="detail-row">
                            <span class="detail-label">Created By:</span>
                            <span class="detail-value">
                                {{ optional($purchase->user)->name ?? 'N/A' }}
                            </span>
                        </div>
                    </div>
                </td>

                <td class="info-right">
                    <div class="info-box">
                        <div class="section-title">Supplier Information</div>

                        <div class="detail-row">
                            <span class="detail-label">Supplier:</span>
                            <span class="detail-value">
                                {{ optional($purchase->supplier)->name ?? 'N/A' }}
                            </span>
                        </div>

                        <div class="detail-row">
                            <span class="detail-label">Phone:</span>
                            <span class="detail-value">
                                {{ optional($purchase->supplier)->phone ?? 'N/A' }}
                            </span>
                        </div>

                        <div class="detail-row">
                            <span class="detail-label">Email:</span>
                            <span class="detail-value">
                                {{ optional($purchase->supplier)->email ?? 'N/A' }}
                            </span>
                        </div>

                        <div class="detail-row">
                            <span class="detail-label">Address:</span>
                            <span class="detail-value">
                                {{ optional($purchase->supplier)->address ?? 'N/A' }}
                            </span>
                        </div>
                    </div>
                </td>
            </tr>
        </table>

        <table class="items-table">
            <thead>
                <tr>
                    <th class="serial">#</th>
                    <th class="product">Product</th>
                    <th class="quantity">Quantity</th>
                    <th class="price">Buy Price</th>
                    <th class="subtotal">Subtotal</th>
                </tr>
            </thead>

            <tbody>
                @forelse ($purchase->items as $index => $item)
                    <tr>
                        <td class="serial">{{ $index + 1 }}</td>

                        <td class="product">
                            {{ optional($item->product)->name ?? 'Deleted Product' }}
                        </td>

                        <td class="quantity">
                            {{ number_format((float) $item->quantity, 0) }}
                        </td>

                        <td class="price">
                            BDT {{ number_format((float) $item->price, 2) }}
                        </td>

                        <td class="subtotal">
                            BDT {{ number_format((float) $item->subtotal, 2) }}
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" style="text-align: center;">
                            No purchase items found.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>

        <div class="summary-wrapper clearfix">
            <div class="summary-spacer">&nbsp;</div>

            <div class="summary-box">
                <table class="summary-table">
                    <tr>
                        <td class="summary-label">Subtotal</td>
                        <td class="summary-value">
                            BDT {{ number_format((float) $purchase->subtotal, 2) }}
                        </td>
                    </tr>

                    <tr>
                        <td class="summary-label">Discount</td>
                        <td class="summary-value">
                            BDT {{ number_format((float) ($purchase->discount ?? 0), 2) }}
                        </td>
                    </tr>

                    <tr>
                        <td class="summary-label">Shipping</td>
                        <td class="summary-value">
                            BDT {{ number_format((float) ($purchase->shipping ?? 0), 2) }}
                        </td>
                    </tr>

                    <tr class="grand-total">
                        <td>Grand Total</td>
                        <td class="summary-value">
                            BDT {{ number_format((float) $purchase->total, 2) }}
                        </td>
                    </tr>
                </table>
            </div>
        </div>

        <div class="note-box">
            <div class="note-title">Note</div>

            <div class="note-text">
                {{ filled($purchase->note)
                    ? $purchase->note
                    : 'No note was added for this purchase.' }}
            </div>
        </div>

        <table class="signature-table">
            <tr>
                <td class="signature-left">
                    <div class="signature-line">Supplier Signature</div>
                </td>

                <td class="signature-right">
                    <div class="signature-line">Authorized Signature</div>
                </td>
            </tr>
        </table>

        <div class="footer">
            This purchase document was generated automatically by NuhaMart.
        </div>

    </div>
</body>
</html>
