<!DOCTYPE html>
<html>

<head>

    <meta charset="utf-8">

    <title>
        Invoice {{ $order->order_number }}
    </title>

    <style>

        *{
            margin:0;
            padding:0;
            box-sizing:border-box;
            font-family: DejaVu Sans,sans-serif;
        }

        body{

            font-size:13px;
            color:#333;
            padding:35px;

        }

        .container{

            width:100%;

        }

        .header{

            border-bottom:4px solid #2563eb;
            padding-bottom:20px;
            margin-bottom:30px;
            overflow:hidden;

        }

        .company{

            width:55%;
            float:left;

        }

        .invoice{

            width:45%;
            float:right;
            text-align:right;

        }

        .logo{

            font-size:34px;
            font-weight:bold;
            color:#2563eb;

        }

        .subtitle{

            color:#666;
            margin-top:5px;

        }

        .address{

            margin-top:18px;
            line-height:22px;
            color:#555;

        }

        .invoice-title{

            font-size:38px;
            font-weight:bold;

        }

        .invoice-box{

            margin-top:15px;
            line-height:24px;

        }

        .clearfix{
            clear:both;
        }

        .card{

            border:1px solid #ddd;
            padding:20px;
            margin-top:25px;
            overflow:hidden;
            border-radius:5px;

        }

        .left{

            width:48%;
            float:left;

        }

        .right{

            width:48%;
            float:right;

        }

        .title{

            font-size:17px;
            font-weight:bold;
            border-bottom:1px solid #ddd;
            padding-bottom:8px;
            margin-bottom:15px;

        }

        .row{

            margin-bottom:10px;

        }

        .label{

            font-weight:bold;

        }

        table{

            width:100%;
            border-collapse:collapse;
            margin-top:30px;

        }

        table th{

            background:#2563eb;
            color:white;
            padding:12px;
            border:1px solid #ddd;
            font-size:13px;

        }

        table td{

            border:1px solid #ddd;
            padding:11px;
            font-size:12px;

        }

        .text-center{

            text-align:center;

        }

        .text-right{

            text-align:right;

        }

        .summary{

            width:40%;
            float:right;
            margin-top:30px;

        }

        .summary table{

            margin-top:0;

        }

        .summary td{

            padding:10px;

        }

        .grand{

            background:#2563eb;
            color:white;
            font-weight:bold;
            font-size:15px;

        }

    </style>

</head>

<body>

<div class="container">

<div class="header">

<div class="company">

<div class="logo">

NuhaMart

</div>

<div class="subtitle">

Professional Inventory & POS System

</div>

<div class="address">

Dhaka, Bangladesh

<br>

support@nuhamart.com

<br>

+8801700000000

</div>

</div>

<div class="invoice">

<div class="invoice-title">

INVOICE

</div>

<div class="invoice-box">

<strong>Invoice No</strong>

<br>

{{ $order->order_number }}

<br><br>

<strong>Date</strong>

<br>

{{ $order->created_at->format('d M Y') }}

</div>

</div>

</div>

<div class="clearfix"></div>

<div class="card">

<div class="left">

<div class="title">

Customer Information

</div>

<div class="row">

<span class="label">

Customer :

</span>

{{ $order->customer_name }}

</div>

<div class="row">

<span class="label">

Phone :

</span>

{{ $order->customer_phone }}

</div>

<div class="row">

<span class="label">

Email :

</span>

{{ $order->customer_email ?: '-' }}

</div>

<div class="row">

<span class="label">

Address :

</span>

{{ $order->customer_address }}

</div>

</div>

<div class="right">

<div class="title">

Payment Information

</div>

<div class="row">

<span class="label">

Method :

</span>

{{ $order->payment_method }}

</div>

<div class="row">

<span class="label">

Payment :

</span>

{{ $order->payment_status }}

</div>

<div class="row">

<span class="label">

Order :

</span>

{{ $order->order_status }}

</div>

</div>

</div>

<div class="clearfix"></div>

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

{{ $item->product->name }}

</td>

<td class="text-center">

{{ $item->quantity }}

</td>

<td class="text-right">

৳ {{ number_format($item->price,2) }}

</td>

<td class="text-right">

৳ {{ number_format($item->subtotal,2) }}

</td>

</tr>

@endforeach

</tbody>

</table>
