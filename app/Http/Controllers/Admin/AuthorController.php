<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAuthorRequest;
use App\Http\Requests\UpdateAuthorRequest;
use App\Models\Author;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
class AuthorController extends Controller
{
    public function index(): Response { return Inertia::render('Admin/Authors/Index',['auth'=>['user'=>auth()->user()],'authors'=>Author::orderBy('sort_order')->orderBy('name')->paginate(15)]); }
    public function create(): Response { return Inertia::render('Admin/Authors/Create',['auth'=>['user'=>auth()->user()]]); }
    public function store(StoreAuthorRequest $request): RedirectResponse { $data=$request->validated(); $data['slug']=$this->slug($data['name']); Author::create($data); return redirect()->route('admin.authors.index')->with('success','Author created successfully.'); }
    public function edit(Author $author): Response { return Inertia::render('Admin/Authors/Edit',['auth'=>['user'=>auth()->user()],'author'=>$author]); }
    public function update(UpdateAuthorRequest $request, Author $author): RedirectResponse { $data=$request->validated(); if($data['name']!==$author->name){$data['slug']=$this->slug($data['name'],$author->id);} $author->update($data); return redirect()->route('admin.authors.index')->with('success','Author updated successfully.'); }
    public function destroy(Author $author): RedirectResponse { $author->delete(); return back()->with('success','Author deleted successfully.'); }
    private function slug(string $name, ?int $ignore=null): string { $base=Str::slug($name) ?: 'author'; $slug=$base; $i=2; while(Author::when($ignore,fn($q)=>$q->whereKeyNot($ignore))->where('slug',$slug)->exists()){$slug=$base.'-'.$i++;} return $slug; }
}
