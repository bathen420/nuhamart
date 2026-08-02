<?php

namespace Database\Seeders;

use App\Models\HomepageBanner;
use App\Models\HomepagePromotion;
use Illuminate\Database\Seeder;

class HomepageContentSeeder extends Seeder
{
    public function run(): void
    {
        HomepageBanner::firstOrCreate(['title' => 'বই থেকে গ্যাজেট,'], [
            'badge' => 'BIG OFFER',
            'highlight' => 'সবকিছু এক ঠিকানায়।',
            'subtitle' => 'আপনার পছন্দের সব প্রোডাক্ট এখন এক ক্লিকে। দ্রুত ডেলিভারি, সেরা দাম এবং নিরাপদ কেনাকাটা।',
            'primary_button_text' => 'Shop Now',
            'primary_button_url' => '/shop',
            'secondary_button_text' => 'Explore Categories',
            'secondary_button_url' => '/shop',
            'background_from' => '#fff4e9',
            'background_to' => '#ffe0bd',
            'text_color' => '#102b4e',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        HomepageBanner::firstOrCreate(['title' => 'পড়ুন, শিখুন,'], [
            'badge' => 'E-BOOK LIBRARY',
            'highlight' => 'নিজেকে এগিয়ে নিন।',
            'subtitle' => 'হার্ডকপি বইয়ের পাশাপাশি আপনার ডিজিটাল লাইব্রেরির জন্য বেছে নিন জনপ্রিয় ই-বুক।',
            'primary_button_text' => 'Explore E-Books',
            'primary_button_url' => '/shop?product_type=ebook',
            'background_from' => '#eafff7',
            'background_to' => '#c8f4e5',
            'text_color' => '#113a32',
            'sort_order' => 2,
            'is_active' => true,
        ]);

        HomepagePromotion::firstOrCreate(['title' => 'E-Books Library'], [
            'subtitle' => 'পড়ুন, শিখুন, উন্নতি করুন — হাজারো ই-বুক আপনার হাতের নাগালে।',
            'button_text' => 'Explore E-Books',
            'button_url' => '/shop?product_type=ebook',
            'theme' => 'mint',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        HomepagePromotion::firstOrCreate(['title' => 'Gadget Fest'], [
            'subtitle' => 'স্মার্ট লাইফের স্মার্ট সঙ্গী — বাছাই করা গ্যাজেট ও অ্যাক্সেসরিজ।',
            'button_text' => 'Shop Gadgets',
            'button_url' => '/shop',
            'theme' => 'purple',
            'sort_order' => 2,
            'is_active' => true,
        ]);
    }
}
