@php
    $business = \App\Models\BusinessSetting::current();
    $public = $business->publicPayload();
@endphp
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title inertia>{{ $business->seo_title ?: $business->company_name }}</title>
    <meta name="description" content="{{ $business->seo_description }}">
    @if($business->seo_keywords)
        <meta name="keywords" content="{{ $business->seo_keywords }}">
    @endif
    @if($business->google_verification)
        <meta name="google-site-verification" content="{{ $business->google_verification }}">
    @endif
    @if($business->bing_verification)
        <meta name="msvalidate.01" content="{{ $business->bing_verification }}">
    @endif
    @if($public['favicon'])
        <link rel="icon" href="{{ $public['favicon'] }}">
    @endif

    <meta property="og:type" content="website">
    <meta property="og:site_name" content="{{ $business->company_name }}">
    <meta property="og:title" content="{{ $business->seo_title ?: $business->company_name }}">
    <meta property="og:description" content="{{ $business->seo_description }}">
    @if($public['og_image'])
        <meta property="og:image" content="{{ $public['og_image'] }}">
    @endif

    <meta name="twitter:card" content="{{ $business->twitter_card ?: 'summary_large_image' }}">
    <meta name="twitter:title" content="{{ $business->seo_title ?: $business->company_name }}">
    <meta name="twitter:description" content="{{ $business->seo_description }}">
    @if($public['og_image'])
        <meta name="twitter:image" content="{{ $public['og_image'] }}">
    @endif

    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx'])
    @inertiaHead
</head>
<body class="font-sans antialiased">
    @inertia
</body>
</html>
