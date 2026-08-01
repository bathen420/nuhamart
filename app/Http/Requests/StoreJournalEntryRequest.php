<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class StoreJournalEntryRequest extends FormRequest {
 public function authorize(): bool { return $this->user()?->can('journals.create') ?? false; }
 public function rules(): array { return ['entry_date'=>'required|date','reference'=>'nullable|string|max:100','description'=>'nullable|string|max:1000','lines'=>'required|array|min:2','lines.*.account_id'=>'required|exists:accounts,id','lines.*.debit'=>'nullable|numeric|min:0','lines.*.credit'=>'nullable|numeric|min:0','lines.*.memo'=>'nullable|string|max:255']; }
 public function after(): array { return [function($v){$lines=collect($this->input('lines',[]));$d=round((float)$lines->sum(fn($x)=>(float)($x['debit']??0)),2);$c=round((float)$lines->sum(fn($x)=>(float)($x['credit']??0)),2);if($d<=0||$c<=0||$d!==$c)$v->errors()->add('lines','Total debit and credit must be equal and greater than zero.');foreach($lines as $i=>$x){if((float)($x['debit']??0)>0&&(float)($x['credit']??0)>0)$v->errors()->add("lines.$i",'A line cannot contain both debit and credit.');}}]; }
}
