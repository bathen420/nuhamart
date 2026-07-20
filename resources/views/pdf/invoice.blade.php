<!DOCTYPE html>
<html>

<head>

    <meta charset="utf-8">

    <title>
        Invoice {{ $order->order_number }}
    </title>

    <style>

        *{
            box-sizing:border-box;
            font-family: DejaVu Sans, sans-serif;
        }

        body{

            margin:40px;
            color:#333;

        }

        .header{

            width:100%;
            overflow:hidden;
            margin-bottom:30px;
            border-bottom:2px solid #0d6efd;
            padding-bottom:20px;

        }

        .left{

            width:50%;
            float:left;

        }

        .right{

            width:50%;
            float:right;
            text-align:right;

        }

        h1{

            margin:0;
            color:#0d6efd;
            font-size:34px;

        }

        h2{

            margin:0;
            font-size:32px;

        }

        p{

            margin:5px 0;

        }

        .clear{

            clear:both;

        }

        .card{

            border:1px solid #ddd;
            padding:20px;
            margin-top:25px;
            border-radius:6px;

        }

        .half{

            width:48%;
            float:left;

        }

        .half-right{

            width:48%;
            float:right;

        }

        .title{

            font-size:18px;
            font-weight:bold;
            margin-bottom:15px;
            border-bottom:1px solid #ddd;
            padding-bottom:8px;

        }

        table{

            width:100%;
            border-collapse:collapse;
            margin-top:30px;

        }

        table th{

            background:#0d6efd;
            color:#fff;
            padding:12px;
            border:1px solid #ddd;
            font-size:14px;

        }

        table td{

            padding:12px;
            border:1px solid #ddd;
            font-size:13px;

        }

        .text-center{

            text-align:center;

        }

        .text-right{

            text-align:right;

        }

    </style>

</head>

<body>

<div class="header">

    <div class="left">

        <h1>NuhaMart</h1>

        <p>Professional Inventory & POS System</p>

        <p>Dhaka, Bangladesh</p>

        <p>support@nuhamart.com</p>

        <p>+8801700000000</p>

    </div>

    <div class="right">

        <h2>INVOICE</h2>

        <br>

        <strong>Invoice No:</strong>

        <br>

        {{ $order->order_number }}

        <br><br>

        <strong>Date:</strong>

        <br>

        {{ $order->created_at->format('d M Y') }}

    </div>

</div>

<div class="clear"></div>

<div class="card">

    <div class="half">

        <div class="title">
            Customer Information
        </div>

        <p>

            <strong>Name :</strong>

            {{ $order->customer_name }}

        </p>

        <p>

            <strong>Phone :</strong>

            {{ $order->customer_phone }}

        </p>

        <p>

            <strong>Email :</strong>

            {{ $order->customer_email ?: '-' }}

        </p>

        <p>

            <strong>Address :</strong>

            {{ $order->customer_address }}

        </p>

    </div>

    <div class="half-right">

        <div class="title">
            Payment Information
        </div>

        <p>

            <strong>Payment Method :</strong>

            {{ $order->payment_method }}

        </p>

        <p>

            <strong>Payment Status :</strong>

            {{ $order->payment_status }}

        </p>

        <p>

            <strong>Order Status :</strong>

            {{ $order->order_status }}

        </p>

    </div>

</div>

<div class="clear"></div>

<table>

    <thead>

        <tr>

            <th width="8%">
                #
            </th>

            <th>
                Product
            </th>

            <th width="12%">
                Qty
            </th>

            <th width="20%">
                Unit Price
            </th>

            <th width="22%">
                Total
            </th>

        </tr>

    </thead>

    <tbody>

        @foreach($order->items as $item)

        <tr>

            <td class="text-center">
                {{ $loop->iteration }}
            </td>

            <td>
                {{ $item->product->name ?? '-' }}
            </td>

            <td class="text-center">
                {{ $item->quantity }}
            </td>

            <td class="text-right">
                ৳ {{ number_format($item->price, 2) }}
            </td>

            <td class="text-right">
                ৳ {{ number_format($item->subtotal, 2) }}
            </td>

        </tr>

        @endforeach

    </tbody>

</table>

<br><br>

<table style="width:40%; float:right;">

    <tr>

        <td>
            Subtotal
        </td>

        <td class="text-right">
            ৳ {{ number_format($order->subtotal,2) }}
        </td>

    </tr>

    <tr>

        <td>
            Discount
        </td>

        <td class="text-right">
            ৳ {{ number_format($order->discount,2) }}
        </td>

    </tr>

    <tr>

        <td>
            Shipping
        </td>

        <td class="text-right">
            ৳ {{ number_format($order->shipping,2) }}
        </td>

    </tr>

    <tr>

        <td>

            <strong>
                Grand Total
            </strong>

        </td>

        <td class="text-right">

            <strong>

                ৳ {{ number_format($order->total,2) }}

            </strong>

        </td>

    </tr>

</table>

<div class="clear"></div>

<br><br><br>

@if($order->note)

<div style="margin-top:40px;">

    <h3>Notes</h3>

    <p>

        {{ $order->note }}

    </p>

</div>

@endif

<div style="margin-top:80px;">

    <div style="width:45%; float:left;">

        <p>

            ___________________________

        </p>

        <strong>

            Customer Signature

        </strong>

    </div>

    <div style="width:45%; float:right; text-align:right;">

        <p>

            ___________________________

        </p>

        <strong>

            Authorized Signature

        </strong>

    </div>

</div>

<div class="clear"></div>

<hr style="margin-top:70px;">

<div style="text-align:center; margin-top:20px;">

    <h2 style="color:#0d6efd; margin-bottom:8px;">

        Thank You For Your Business ❤️

    </h2>

    <p>

        This invoice was generated by

        <strong>NuhaMart Inventory & POS System</strong>

    </p>

</div>

</body>

</html>