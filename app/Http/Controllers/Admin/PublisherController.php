<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Http\Requests\StorePublisherRequest;
use App\Http\Requests\UpdatePublisherRequest;
use App\Models\Publisher;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
class PublisherController extends Controller
{
    public function index(): Response { return Inertia::render('Admin/Publishers/Index',['auth'=>['user'=>auth()->user()],'publishers'=>Publisher::orderBy('sort_order')->orderBy('name')->paginate(15)]); }
    public function create(): Response { return Inertia::render('Admin/Publishers/Create',['auth'=>['user'=>auth()->user()]]); }
    public function store(StorePublisherRequest $request): RedirectResponse { $data=$request->validated(); $data['slug']=$this->slug($data['name']); Publisher::create($data); return redirect()->route('admin.publishers.index')->with('success','Publisher created successfully.'); }
    public function edit(Publisher $publisher): Response { return Inertia::render('Admin/Publishers/Edit',['auth'=>['user'=>auth()->user()],'publisher'=>$publisher]); }
    public function update(UpdatePublisherRequest $request, Publisher $publisher): RedirectResponse { $data=$request->validated(); if($data['name']!==$publisher->name){$data['slug']=$this->slug($data['name'],$publisher->id);} $publisher->update($data); return redirect()->route('admin.publishers.index')->with('success','Publisher updated successfully.'); }
    public function destroy(Publisher $publisher): RedirectResponse { $publisher->delete(); return back()->with('success','Publisher deleted successfully.'); }
    private function slug(string $name, ?int $ignore=null): string { $base=Str::slug($name) ?: 'publisher'; $slug=$base; $i=2; while(Publisher::when($ignore,fn($q)=>$q->whereKeyNot($ignore))->where('slug',$slug)->exists()){$slug=$base.'-'.$i++;} return $slug; }
}
