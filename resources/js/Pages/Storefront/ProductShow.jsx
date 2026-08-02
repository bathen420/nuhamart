import { useI18n } from "@/i18n";
import { Head, Link, router } from "@inertiajs/react";
import { BookOpen, Check, ChevronLeft, ChevronRight, Heart, Minus, Plus, ShieldCheck, ShoppingCart, Truck, X, ZoomIn } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import StorefrontLayout from "@/Layouts/StorefrontLayout";
import useCart from "@/hooks/useCart";
import ProductGrid from "@/Components/Storefront/ProductGrid";

const money=(v)=>`৳${Number(v||0).toLocaleString("en-BD",{maximumFractionDigits:2})}`;
const placeholder='https://placehold.co/900x1100?text=Nuha+Mart+BD';

function ProductSection({title,products=[]}){
    if(!products?.length)return null;
    return <section className="mt-12"><div className="mb-5 flex items-end justify-between"><div><p className="text-xs font-black uppercase tracking-[.22em] text-orange-600">Discover more</p><h2 className="mt-1 text-2xl font-black text-slate-900">{title}</h2></div></div><ProductGrid products={products}/></section>
}

export default function ProductShow({product,related=[],sameAuthor=[],samePublisher=[]}){
    const {t}=useI18n();
    const {addToCart}=useCart();
    const [qty,setQty]=useState(1);
    const [wish,setWish]=useState(false);
    const [active,setActive]=useState(0);
    const [zoom,setZoom]=useState(false);
    const images=useMemo(()=>[product.image,...(product.gallery_images||[])].filter(Boolean),[product]);
    const displayImages=images.length?images:[placeholder];
    const isEbook=product.product_type==='ebook';
    const price=Number(isEbook?(product.ebook_price??product.sale_price??product.price):(product.sale_price??product.price));
    const max=isEbook?100:Math.max(1,Number(product.stock||1));
    const inStock=isEbook||product.stock>0;

    useEffect(()=>{try{setWish(JSON.parse(localStorage.getItem('nuhamart_wishlist')||'[]').includes(product.id))}catch{}},[product.id]);
    useEffect(()=>{try{const current=JSON.parse(localStorage.getItem('nuhamart_recent_products')||'[]');localStorage.setItem('nuhamart_recent_products',JSON.stringify([product.id,...current.filter(id=>id!==product.id)].slice(0,12)))}catch{}},[product.id]);

    const toggleWish=()=>{let ids=[];try{ids=JSON.parse(localStorage.getItem('nuhamart_wishlist')||'[]')}catch{}ids=ids.includes(product.id)?ids.filter(id=>id!==product.id):[...ids,product.id];localStorage.setItem('nuhamart_wishlist',JSON.stringify(ids));setWish(ids.includes(product.id))};
    const buy=()=>{addToCart(product,qty);router.visit(route('checkout.index'))};
    const previous=()=>setActive(i=>(i-1+displayImages.length)%displayImages.length);
    const next=()=>setActive(i=>(i+1)%displayImages.length);

    const specs=[['SKU',product.sku],['ISBN',product.isbn],['Publisher',product.publisher?.name],['Edition',product.edition],[t('language'),product.language],[t('pages'),product.pages],[t('binding'),product.binding],['Publication Year',product.publication_year],['Weight',product.weight?`${product.weight} kg`:null],['Dimensions',product.dimensions]].filter(x=>x[1]);

    return <StorefrontLayout>
        <Head title={product.name}/>
        <main className="bg-slate-50 pb-28 pt-5 md:pb-10 md:pt-8">
            <div className="mx-auto max-w-7xl px-4">
                <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm text-slate-500"><Link href={route('home')} className="hover:text-orange-600">Home</Link><span>/</span>{product.category&&<><Link href={route('storefront.catalog',{category:product.category.slug})} className="hover:text-orange-600">{product.category.name}</Link><span>/</span></>}<span className="line-clamp-1 text-slate-800">{product.name}</span></nav>

                <div className="grid gap-8 rounded-3xl bg-white p-4 shadow-sm lg:grid-cols-[1.05fr_.95fr] lg:p-8">
                    <section className="grid gap-4 sm:grid-cols-[82px_1fr]">
                        <div className="order-2 flex gap-2 overflow-x-auto sm:order-1 sm:flex-col">
                            {displayImages.map((src,index)=><button key={`${src}-${index}`} onClick={()=>setActive(index)} className={`shrink-0 overflow-hidden rounded-xl border-2 bg-white p-1 transition ${active===index?'border-orange-500':'border-slate-200 hover:border-slate-400'}`}><img src={src} alt="" className="h-16 w-16 object-contain" loading="lazy"/></button>)}
                        </div>
                        <div className="order-1 relative min-h-[390px] overflow-hidden rounded-2xl border bg-slate-50 sm:order-2 lg:min-h-[560px]">
                            <button onClick={()=>setZoom(true)} className="group flex h-full w-full items-center justify-center p-6" aria-label="Zoom product image"><img className="max-h-[540px] w-full object-contain transition duration-300 group-hover:scale-[1.03]" src={displayImages[active]} alt={product.name}/><span className="absolute right-4 top-4 rounded-full bg-white p-2 shadow"><ZoomIn size={18}/></span></button>
                            {product.discount>0&&<span className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1 text-sm font-black text-white">-{product.discount}%</span>}
                            {displayImages.length>1&&<><button onClick={previous} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow"><ChevronLeft/></button><button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow"><ChevronRight/></button></>}
                        </div>
                    </section>

                    <section>
                        <div className="text-sm font-black uppercase tracking-wide text-orange-600">{product.category?.name}</div>
                        <h1 className="mt-2 text-3xl font-black leading-tight text-slate-900 md:text-4xl">{product.name}</h1>
                        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-slate-600">{product.author&&<Link href={route('storefront.author',product.author.slug)} className="hover:text-orange-600">By {product.author.name}</Link>}{product.publisher&&<Link href={route('storefront.publisher',product.publisher.slug)} className="hover:text-orange-600">{product.publisher.name}</Link>}{product.isbn&&<span>ISBN: {product.isbn}</span>}</div>

                        <div className="mt-6 rounded-2xl bg-orange-50 p-5"><div className="flex flex-wrap items-end gap-3"><span className="text-4xl font-black text-orange-600">{money(price)}</span>{product.sale_price&&<span className="pb-1 text-lg text-slate-400 line-through">{money(product.price)}</span>}{product.discount>0&&<span className="mb-1 rounded-full bg-red-100 px-3 py-1 text-sm font-black text-red-700">Save {product.discount}%</span>}</div></div>

                        <div className="mt-5 flex flex-wrap gap-2 text-sm"><span className={`rounded-full px-3 py-1.5 font-black ${inStock?'bg-green-50 text-green-700':'bg-red-50 text-red-700'}`}>{isEbook?'Instant digital delivery':inStock?`${product.stock} in stock`:'Out of stock'}</span><span className="rounded-full bg-slate-100 px-3 py-1.5 font-black capitalize">{product.product_type}</span>{product.language&&<span className="rounded-full bg-blue-50 px-3 py-1.5 font-black text-blue-700">{product.language}</span>}</div>

                        {product.short_description&&<p className="mt-5 leading-7 text-slate-600">{product.short_description}</p>}

                        <div className="mt-7 rounded-2xl border border-slate-200 p-5 shadow-sm">
                            <div className="flex flex-wrap items-center gap-3"><div className="flex items-center rounded-xl border"><button onClick={()=>setQty(Math.max(1,qty-1))} className="p-3"><Minus size={17}/></button><span className="w-11 text-center font-black">{qty}</span><button onClick={()=>setQty(Math.min(max,qty+1))} className="p-3"><Plus size={17}/></button></div><button onClick={()=>addToCart(product,qty)} disabled={!inStock} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3.5 font-black text-white shadow-lg shadow-orange-100 transition hover:bg-orange-700 disabled:opacity-40"><ShoppingCart size={19}/>{t('addToCart')}</button><button onClick={buy} disabled={!inStock} className="flex-1 rounded-xl bg-slate-900 px-5 py-3.5 font-black text-white transition hover:bg-slate-800 disabled:opacity-40">{t('buyNow')}</button><button onClick={toggleWish} className={`rounded-xl border p-3.5 ${wish?'border-red-200 bg-red-50 text-red-600':''}`} aria-label="Wishlist"><Heart size={20} fill={wish?'currentColor':'none'}/></button></div>
                            <p className="mt-3 text-center text-xs font-semibold text-slate-500">Secure checkout · Cash on delivery available · Easy order tracking</p>
                        </div>

                        {product.sample_file&&<a href={product.sample_file} target="_blank" rel="noreferrer" className="mt-4 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-orange-300 bg-orange-50 px-5 py-3 font-black text-orange-700 hover:bg-orange-100"><BookOpen size={19}/> Read sample PDF</a>}

                        <div className="mt-6 grid gap-3 sm:grid-cols-3"><div className="flex gap-2 rounded-xl bg-slate-50 p-3"><Truck className="shrink-0 text-orange-600"/><span className="text-xs font-bold">Fast delivery across Bangladesh</span></div><div className="flex gap-2 rounded-xl bg-slate-50 p-3"><ShieldCheck className="shrink-0 text-orange-600"/><span className="text-xs font-bold">Secure order processing</span></div><div className="flex gap-2 rounded-xl bg-slate-50 p-3"><Check className="shrink-0 text-orange-600"/><span className="text-xs font-bold">Original products</span></div></div>
                    </section>
                </div>

                <section className="mt-8 grid gap-6 lg:grid-cols-[1.45fr_.55fr]"><div className="rounded-3xl bg-white p-6 shadow-sm"><h2 className="text-2xl font-black">{t('description')}</h2><div className="mt-4 whitespace-pre-line leading-8 text-slate-700">{product.description||t('noDescription')}</div></div>{specs.length>0&&<aside className="rounded-3xl bg-white p-6 shadow-sm"><h2 className="text-xl font-black">Product details</h2><dl className="mt-4 divide-y">{specs.map(([k,v])=><div key={k} className="grid grid-cols-2 gap-3 py-3 text-sm"><dt className="text-slate-500">{k}</dt><dd className="text-right font-bold capitalize text-slate-900">{v}</dd></div>)}</dl></aside>}</section>

                <ProductSection title={product.author?`More by ${product.author.name}`:'Same author'} products={sameAuthor}/>
                <ProductSection title={product.publisher?`More from ${product.publisher.name}`:'Same publisher'} products={samePublisher}/>
                <ProductSection title={t('related')} products={related}/>
            </div>
        </main>

        <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-[62px_1fr_1fr] gap-2 border-t bg-white p-3 shadow-2xl md:hidden"><button onClick={toggleWish} className={`flex items-center justify-center rounded-xl border ${wish?'text-red-600':''}`}><Heart fill={wish?'currentColor':'none'}/></button><button onClick={()=>addToCart(product,qty)} disabled={!inStock} className="rounded-xl bg-orange-600 px-3 py-3 font-black text-white disabled:opacity-40">{t('addToCart')}</button><button onClick={buy} disabled={!inStock} className="rounded-xl bg-slate-900 px-3 py-3 font-black text-white disabled:opacity-40">{t('buyNow')}</button></div>

        {zoom&&<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4" role="dialog" aria-modal="true"><button onClick={()=>setZoom(false)} className="absolute right-5 top-5 rounded-full bg-white p-2"><X/></button><img src={displayImages[active]} alt={product.name} className="max-h-[92vh] max-w-[94vw] object-contain"/></div>}
    </StorefrontLayout>
}
